var generarIdUnicoFecha = ()=>{
    let fecha = new Date();
    return Math.floor(fecha.getTime()/1000).toString(16);
}, db;
var appSistema = new Vue({
    el: '#appSistema',
    data: {
        forms:{
            'cliente':{mostrar:false},
            'producto':{mostrar:false},
            'proveedor':{mostrar:false},
            'categoria':{mostrar:false}
        }
    },
    methods: {
        abrirBd(){
            /**
             * Mecanismos de Almacenamiento
             * 1. WebSQL
             * 2. localStorage
             * 3. IndexedDB
             */
            let indexDb = indexedDB.open('db_sistema', 1);
            indexDb.onupgradeneeded = e=>{
                let db = e.target.result;
                tblcliente = db.createObjectStore('cliente', {keyPath:'idCliente'});
                tblproducto = db.createObjectStore('producto', {keyPath:'idProducto'});
                tblproveedor = db.createObjectStore('proveedor', {keyPath:'idProveedor'});
                tblcategoria = db.createObjectStore('categoria', {keyPath:'idCategoria'});

                tblcliente.createIndex('idCliente', 'idCliente', {unique:true});
                tblcliente.createIndex('codigo', 'codigo', {unique:false});

                tblproducto.createIndex('idProducto', 'idProducto', {unique:true});
                tblproducto.createIndex('codigo', 'codigo', {unique:false});

                tblcategoria.createIndex('idCategoria', 'idCategoria', {unique:true});
                tblcategoria.createIndex('codigo', 'codigo', {unique:false});
            };
            indexDb.onsuccess = e=>{
                db = e.target.result;
            };
            indexDb.onerror = e=>{
                console.log(e.target.error);
            };
        },
    },
    created(){
        this.abrirBd();
    }
});
function abrirStore(store, modo){
    return db.transaction(store, modo).objectStore(store);
}
document.addEventListener('DOMContentLoaded', e=>{
    let formularios = document.querySelectorAll('.mostrar').forEach(formulario=>{
        formulario.addEventListener('click', evento=>{
            let formulario = evento.target.dataset.form;
            appSistema.forms[formulario].mostrar = true;
            appSistema.$refs[formulario].obtenerDatos();
        });
    });
});