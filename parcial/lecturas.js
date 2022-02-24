Vue.component('component-libros',{
    data:()=>{
        return {
            msg    : '',
            status : false,
            error  : false,
            buscar : "",
            libro:{
                idLibro : 0,
                idAutor:  0,
                codigo : '',
                editorial : '',
                edicion : '',
        
            },
            libros:[]
        }
    },
    methods:{
       
        nuevaLectura(){
            this.limpiar();
            let store = this.abrirStore('tbllibros','readonly'),
                data = store.getAll();
            data.onsuccess=resp=>{
                if(data.result.length==0){
                    let autores = this.abrirStore('tblclientes','readonly'),
                        datosClientes = autores.getAll();
                    datosClientes.onsuccess=datacliente=>{
                        datosClientes.result.forEach(element => {
                            this.libro.libros.push({
                                autor   : element.nombre,
                                lanterior : 0,
                                lactual   : '',
                                pago      : ''
                            });
                        });
                    };
                } else {
                    data.result[data.result.length - 1].libros.forEach(element => {
                        this.libro.libros.push({
                            autor   : element.autor, 
                            lanterior : element.lactual, 
                            lactual   : '', 
                            pago   : '', 
                        });
                    });
                }
                this.libro.fecha = new Date().toISOString().slice(0,10);
            };
        },
        buscandoLectura(){
            this.libros = this.libros.filter((element,index,libros) => new Date(element.fecha).toLocaleDateString().indexOf(this.buscar)>=0);
            if( this.buscar.length<=0){
                this.obtenerDatos();
            }
        },
        async guardarLectura(){
            
            let store = this.abrirStore("tbllibros",'readwrite');
            if( this.libro.accion=='nuevo' ){
                this.libro.idLibro = generarIdUnicoDesdeFecha();
            }
            let query = store.put(this.libro);
            query.onsuccess=event=>{
                this.obtenerDatos();
                this.limpiar();
                
                this.mostrarMsg('Registro se guardo con exito',false);
            };
            query.onerror=event=>{
                this.mostrarMsg('Error al guardar el registro',true);
                console.log( event );
            };
        },
        mostrarMsg(msg, error){
            this.status = true;
            this.msg = msg;
            this.error = error;
            this.quitarMsg(3);
        },
        quitarMsg(time){
            setTimeout(()=>{
                this.status=false;
                this.msg = '';
                this.error = false;
            }, time*1000);
        },
        obtenerDatos(){
            let store = this.abrirStore('tbllibros','readonly'),
                data = store.getAll();
            data.onsuccess=resp=>{
                this.libros = data.result;
                console.log( this.libros, this.libros[0].libros );
            };
        },
        mostrarLectura(pro){
            this.libro = pro;
            this.libro.accion='modificar';
        },
        limpiar(){
            this.libro.accion='nuevo';
            this.libro.libros = [];
            this.obtenerDatos();
        },
        eliminarLectura(pro){
            if( confirm(`Esta seguro que desea eliminar el libro:  ${ new Date(pro.fecha).toLocaleDateString() }`) ){
                this.libro = pro;
                this.libro.accion='eliminar';
                fetch(`private/modulos/libros/administracion.php?libro=${JSON.stringify(this.libro)}`,
                    {credentials: 'same-origin'})
                    .then(resp=>resp.json())
                    .then(resp=>{
                        this.obtenerDatos();
                        this.limpiar();
                        
                        this.mostrarMsg('Registro se guardo con exito',false);
                    });

                let store = this.abrirStore("tbllibros",'readwrite'),
                    req = store.delete(pro.idLibro);
                req.onsuccess=resp=>{
                    this.mostrarMsg('Registro eliminado con exito',true);
                    this.obtenerDatos();
                };
                req.onerror=resp=>{
                    this.mostrarMsg('Error al eliminar el registro',true);
                    console.log( resp );
                };
            }
        },
        abrirStore(store,modo){
            let tx = db.transaction(store,modo);
            return tx.objectStore(store);
        }
    },
    created(){
        
    },
    template:`
        <form v-on:submit.prevent="guardarLectura" v-on:reset="limpiar">
            <div class="row">
                <div class="col-sm-5">
                    <div class="row p-2">
                        <div class="col-sm text-center text-white bg-primary">
                            <div class="row">
                                <div class="col-11">
                                    <h5>REGISTRO DE LECTURAS</h5>
                                </div>
                                <div class="col-1 align-middle" >
                                    <button type="button" onclick="appVue.forms['libro'].mostrar=false" class="btn-close" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm">FECHA:</div>
                        <div class="col-sm">
                            <input v-model="libro.fecha" required type="date" class="form-control form-control-sm" >
                        </div>
                    </div>
                    <div class="row p-2 bg-success">
                        <div class="col-sm">AUTOR:</div>
                        <div class="col-sm">Lectura Anterior</div>
                        <div class="col-sm">Lectura Actual</div>
                        <div class="col-sm">Pago</div>
                    </div>
                    <div v-for="lecturaCliente in libro.libros" class="row p-2">
                        <div class="col-sm">{{ lecturaCliente.autor }}</div>
                        <div class="col-sm">{{ lecturaCliente.lanterior }}</div>
                        <div class="col-sm">
                            <input @change="calcularPago(lecturaCliente)" v-model="lecturaCliente.lactual" required type="text" class="form-control form-control-sm" >
                        </div>
                        <div class="col-sm">{{ lecturaCliente.pago }}</div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm text-center">
                            <a class="btn btn-success" @click="nuevaLectura" >Nuevo</a>
                            <input type="submit" value="Guardar" class="btn btn-dark">
                            <input type="reset" value="Limpiar" class="btn btn-warning">
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm text-center">
                            <div v-if="status" class="alert" v-bind:class="[error ? 'alert-danger' : 'alert-success']">
                                {{ msg }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm"></div>
                <div class="col-sm-6 p-2">
                    <div class="row text-center text-white bg-primary">
                        <div class="col"><h5>LECTURAS REGISTRADOS</h5></div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <table class="table table-sm table-hover">
                                <thead>
                                    <tr>
                                        <td colspan="5">
                                            <input v-model="buscar" v-on:keyup="buscandoLectura" type="text" class="form-control form-contro-sm" placeholder="Buscar libros">
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>FECHA</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="pro in libros" v-on:click="mostrarLectura(pro)">
                                        <td>{{ new Date(pro.fecha).toLocaleDateString() }}</td>
                                        <td>
                                            <a @click.stop="eliminarLectura(pro)" class="btn btn-danger">Eliminar</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    `
});
