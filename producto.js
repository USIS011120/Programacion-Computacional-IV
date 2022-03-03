Vue.component('v-select-categoria',VueSelect.VueSelect);
Vue.component('producto',{
    data:()=>{
        return {
            buscar:'',
            productos:[],
            categorias:[],
            producto:{
                accion : 'nuevo',
                mostrar_msg : false,
                msg : '',
                categoria: {
                    id: '',
                    label: '',
                },
                idProducto : '',
                codigo: '',
                nombre: '',
                marca : '',
                precio : '',
            }
        }
    },
    methods:{
        buscandoProducto(){
            this.obtenerDatos(this.buscar);
        },
        eliminarProducto(producto){
            if( confirm(`Esta seguro de eliminar el producto ${producto.nombre}?`) ){
                let store = abrirStore('producto', 'readwrite'),
                query = store.delete(producto.idProducto);
                query.onsuccess = e=>{
                    this.nuevoProducto();
                    this.obtenerDatos();
                    this.producto.msg = 'Producto eliminado con exito';
                };
                query.onerror = e=>{
                    this.producto.msg = `Error al eliminar el producto ${e.target.error}`;
                };
            }
            this.nuevoProducto();
        },
        modificarProducto(datos){
            this.producto = JSON.parse(JSON.stringify(datos));
            this.producto.accion = 'modificar';
        },
        guardarProducto(){
            let store = abrirStore('producto', 'readwrite');
            if(this.producto.accion=="nuevo"){
                this.producto.idProducto = generarIdUnicoFecha();
            }
            let query = store.put(this.producto);
            query.onsuccess = e=>{
                this.nuevoProducto();
                this.obtenerDatos();
                this.producto.msg = 'Producto procesado con exito';
            };
            query.onerror = e=>{
                this.producto.msg = `Error al procesar el producto ${e.target.error}`;
            };
        },
        obtenerDatos(valor=''){
            let store = abrirStore('producto', 'readonly'),
                data = store.getAll();
            data.onsuccess = e=>{
                this.productos = data.result.filter(producto=>producto.nombre.toLowerCase().indexOf(valor.toLowerCase())>-1);
            };
            data.onerror = e=>{
                console.log(e.target.error);
            };
            let store_cat = abrirStore('categoria', 'readonly'),
                data_cat = store_cat.getAll();
            data_cat.onsuccess = e=>{
                this.categorias = data_cat.result.map(categoria=>{
                    return {
                        id: categoria.idCategoria,
                        label: categoria.nombre
                    }
                });
            };
        },
        nuevoProducto(){
            this.producto.accion = 'nuevo';
            this.producto.msg = '';
            this.producto.idProducto = '';
            this.producto.codigo = '';
            this.producto.nombre = '';
            this.producto.marca = '';
            this.producto.precio = '';
        }
    },
    created(){
       //this.obtenerDatos();
    },
    template:`
        <div id="appCiente">
            <div class="card text-white" id="carProducto">
                <div class="card-header bg-primary">
                    Registro de Productos
                    <button type="button" class="btn-close text-end" data-bs-dismiss="alert" data-bs-target="#carProducto" aria-label="Close"></button>
                </div>
                <div class="card-body text-dark">
                    <form method="post" @submit.prevent="guardarProducto" @reset="nuevoProducto">
                        <div class="row p-1">
                            <div class="col col-md-2">
                                Categoria:
                            </div>
                            <div class="col col-md-3">
                                <v-select-categoria v-model="producto.categoria" 
                                    :options="categorias" placeholder="Seleccione una categoria"/>
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Codigo:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese el codigo" v-model="producto.codigo" pattern="[0-9]{3,10}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Nombre:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese el nombre" v-model="producto.nombre" pattern="[A-Za-zñÑáéíóúü ]{3,75}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Marca:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese la marca" v-model="producto.marca" pattern="[A-Za-zñÑáéíóúü ]{3,75}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Precio:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese el Precio" v-model="producto.precio" pattern="[0-9.]{1,10}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-5 text-center">
                                <div v-if="producto.mostrar_msg" class="alert alert-primary alert-dismissible fade show" role="alert">
                                    {{ producto.msg }}
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
            <div class="card text-white" id="carBuscarProducto">
                <div class="card-header bg-primary">
                    Busqueda de Productos
                    <button type="button" class="btn-close" data-bs-dismiss="alert" data-bs-target="#carBuscarProducto" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table table-dark table-hover">
                        <thead>
                            <tr>
                                <th colspan="7">
                                    Buscar: <input @keyup="buscandoProducto" v-model="buscar" placeholder="buscar aqui" class="form-control" type="text" >
                                </th>
                            </tr>
                            <tr>
                                <th>CODIGO</th>
                                <th>NOMBRE</th>
                                <th>MARCA</th>
                                <th>PRECIO</th>
                                <th>CATEGORIA</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in productos" @click='modificarProducto( item )' :key="item.idProducto">
                                <td>{{item.codigo}}</td>
                                <td>{{item.nombre}}</td>
                                <td>{{item.marca}}</td>
                                <td>{{item.precio}}</td>
                                <td>{{item.categoria.label}}</td>
                                <td>
                                    <button class="btn btn-danger" @click="eliminarProducto(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
});