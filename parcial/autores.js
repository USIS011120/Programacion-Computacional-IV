Vue.component('component-autores',{
    data:()=>{
        return {
            accion : 'nuevo',
            msg    : '',
            status : false,
            error  : false,
            buscar : "",
            autor:{
                idAutor : 0,
                codigo    : '',
                nombre    : '',
                pais : '',
                telefono  : '',
            },
            autores:[]
        }
    },
    methods:{
        buscandoCliente(){
            this.autores = this.autores.filter((element,index,autores) => element.nombre.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 || element.codigo.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 );
            if( this.buscar.length<=0){
                this.obtenerDatos();
            }
        },
        buscandoCodigoCliente(store){
            let buscarCodigo = new Promise( (resolver,rechazar)=>{
                let index = store.index("codigo"),
                    data = index.get(this.autor.codigo);
                data.onsuccess=evt=>{
                    resolver(data);
                };
                data.onerror=evt=>{
                    rechazar(data);
                };
            });
            return buscarCodigo;
        },
        async guardarCliente(){
         
            let store = this.abrirStore("tblautores",'readwrite'),
                duplicado = false;
            if( this.accion=='nuevo' ){
                this.autor.idAutor = generarIdUnicoDesdeFecha();
                
                let data = await this.buscandoCodigoCliente(store);
                duplicado = data.result!=undefined;
            }
            if( duplicado==false){
                let query = store.put(this.autor);
                query.onsuccess=event=>{
                    this.obtenerDatos();
                    this.limpiar();
                    
                    this.mostrarMsg('Registro se guardo con exito',false);
                };
                query.onerror=event=>{
                    this.mostrarMsg('Error al guardar el registro',true);
                    console.log( event );
                };
            } else{
                this.mostrarMsg('Codigo de autor duplicado',true);
            }
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
            let store = this.abrirStore('tblautores','readonly'),
                data = store.getAll();
            data.onsuccess=resp=>{
                this.autores = data.result;
            };
        },
        mostrarCliente(pro){
            this.autor = pro;
            this.accion='modificar';
        },
        limpiar(){
            this.accion='nuevo';
            this.autor.idAutor='';
            this.autor.codigo='';
            this.autor.nombre='';
            this.autor.pais='';
            this.autor.telefono='';
            this.obtenerDatos();
        },
        eliminarCliente(pro){
            if( confirm(`Esta seguro que desea eliminar el autor:  ${pro.descripcion}`) ){
                let store = this.abrirStore("tblautores",'readwrite'),
                    req = store.delete(pro.idAutor);
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
        <form v-on:submit.prevent="guardarCliente" v-on:reset="limpiar">
            <div class="row">
                <div class="col-sm-5">
                    <div class="row p-2">
                        <div class="col-sm text-center text-white bg-primary">
                            <div class="row">
                                <div class="col-11">
                                    <h5>REGISTRO DE AUTORES</h5>
                                </div>
                                <div class="col-1 align-middle" >
                                    <button type="button" onclick="appVue.forms['autor'].mostrar=false" class="btn-close" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm">CODIGO:</div>
                        <div class="col-sm">
                            <input v-model="autor.codigo" required type="text" class="form-control form-control-sm" >
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm">NOMBRE: </div>
                        <div class="col-sm">
                            <input v-model="autor.nombre" required pattern="[A-ZÑña-z0-9, ]{5,65}" type="text" class="form-control form-control-sm">
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm">PAIS: </div>
                        <div class="col-sm">
                            <input v-model="autor.pais" required pattern="[A-ZÑña-z0-9, ]{5,65}" type="text" class="form-control form-control-sm">
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm">TELEFONO: </div>
                        <div class="col-sm">
                            <input v-model="autor.telefono" required type="text" class="form-control form-control-sm">
                        </div>
                    </div>
                    <div class="row p-2">
                        <div class="col-sm text-center">
                            <input type="submit" value="Guardar" class="btn btn-blue">
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
                        <div class="col"><h5>AUTORES REGISTRADOS</h5></div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <table class="table table-sm table-hover">
                                <thead>
                                    <tr>
                                        <td colspan="5">
                                            <input v-model="buscar" v-on:keyup="buscandoCliente" type="text" class="form-control form-contro-sm" placeholder="Buscar autores">
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>CODIGO</th>
                                        <th>NOMBRE</th>
                                        <th>PAIS</th>
                                        <th>TELEFONO</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="pro in autores" v-on:click="mostrarCliente(pro)">
                                        <td>{{ pro.codigo }}</td>
                                        <td>{{ pro.nombre }}</td>
                                        <td>{{ pro.pais }}</td>
                                        <td>{{ pro.telefono }}</td>
                                        <td>
                                            <a @click.stop="eliminarCliente(pro)" class="btn btn-danger">DEL</a>
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