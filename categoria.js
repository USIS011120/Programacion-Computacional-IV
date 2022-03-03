Vue.component('categoria',{
    data:()=>{
        return {
            buscar:'',
            categorias:[],
            categoria:{
                accion : 'nuevo',
                mostrar_msg : false,
                msg : '',
                idCategoria : '',
                codigo: '',
                nombre: '',
            }
        }
    },
    methods:{
        buscandoCategoria(){
            this.obtenerDatos(this.buscar);
        },
        eliminarCategoria(categoria){
            if( confirm(`Esta seguro de eliminar el categoria ${categoria.nombre}?`) ){
                let store = abrirStore('categoria', 'readwrite'),
                query = store.delete(categoria.idCategoria);
                query.onsuccess = e=>{
                    this.nuevoCategoria();
                    this.obtenerDatos();
                    this.categoria.msg = 'Categoria eliminado con exito';
                };
                query.onerror = e=>{
                    this.categoria.msg = `Error al eliminar el categoria ${e.target.error}`;
                };
            }
            this.nuevoCategoria();
        },
        modificarCategoria(datos){
            this.categoria = JSON.parse(JSON.stringify(datos));
            this.categoria.accion = 'modificar';
        },
        guardarCategoria(){
            let store = abrirStore('categoria', 'readwrite');
            if(this.categoria.accion=="nuevo"){
                this.categoria.idCategoria = generarIdUnicoFecha();
            }
            let query = store.put(this.categoria);
            query.onsuccess = e=>{
                this.nuevoCategoria();
                this.obtenerDatos();
                this.categoria.msg = 'Categoria procesado con exito';
            };
            query.onerror = e=>{
                this.categoria.msg = `Error al procesar la categoria ${e.target.error}`;
            };
        },
        obtenerDatos(valor=''){
            let store = abrirStore('categoria', 'readonly'),
                data = store.getAll();
            data.onsuccess = e=>{
                this.categorias = data.result.filter(categoria=>categoria.nombre.toLowerCase().indexOf(valor.toLowerCase())>-1);
            };
            data.onerror = e=>{
                this.categoria.msg = `Error al obtener las categorias ${e.target.error}`;
            };
        },
        nuevoCategoria(){
            this.categoria.accion = 'nuevo';
            this.categoria.msg = '';
            this.categoria.idCategoria = '';
            this.categoria.codigo = '';
            this.categoria.nombre = '';
        }
    },
    created(){
        //this.obtenerDatos();
    },
    template:`
        <div id="appCiente">
            <div class="card text-white" id="carCategoria">
                <div class="card-header bg-primary">
                    Registro de Categorias
                    <button type="button" class="btn-close text-end" data-bs-dismiss="alert" data-bs-target="#carCategoria" aria-label="Close"></button>
                </div>
                <div class="card-body text-dark">
                    <form method="post" @submit.prevent="guardarCategoria" @reset="nuevoCategoria">
                        <div class="row p-1">
                            <div class="col col-md-2">Codigo:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese el codigo" v-model="categoria.codigo" pattern="[0-9]{3,10}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Nombre:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese el nombre" v-model="categoria.nombre" pattern="[A-Za-zñÑáéíóúü ]{3,75}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-5 text-center">
                                <div v-if="categoria.mostrar_msg" class="alert alert-primary alert-dismissible fade show" role="alert">
                                    {{ categoria.msg }}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>
                        <div class="row m-2">
                            <div class="col col-md-5 text-center">
                                <input class="btn btn-success" type="submit" value="Guardar">
                                <input class="btn btn-warning" type="reset" value="Nuevo">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="card text-white" id="carBuscarCategoria">
                <div class="card-header bg-primary">
                    Busqueda de Categorias
                    <button type="button" class="btn-close" data-bs-dismiss="alert" data-bs-target="#carBuscarCategoria" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table table-dark table-hover">
                        <thead>
                            <tr>
                                <th colspan="6">
                                    Buscar: <input @keyup="buscandoCategoria" v-model="buscar" placeholder="buscar aqui" class="form-control" type="text" >
                                </th>
                            </tr>
                            <tr>
                                <th>CODIGO</th>
                                <th>NOMBRE</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in categorias" @click='modificarCategoria( item )' :key="item.idCategoria">
                                <td>{{item.codigo}}</td>
                                <td>{{item.nombre}}</td>
                                <td>
                                    <button class="btn btn-danger" @click="eliminarCategoria(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
});