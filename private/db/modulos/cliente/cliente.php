<?php
include('../../db/DB.php');
class cliente{
    private $dato=[],$db;
    public $respuesta =['msg'=>'correcto'];

    public function cliente($db=''){
        $this->db = $db;
        
    }
    public function recibir_datos($clientes=''){
      $this->datos = json_decode($cliente, true);
      $this->validar_datos();
    }
    private function validas_datos({
        if(empty(trim($this>datos['codigo'])) ){
            $this->respuesta['msg']='Por favor ingrese el codigo';
        }
        if(empty(trim($this>datos['nombre'])) ){
            $this->respuesta['msg']='Por favor ingrese el nombre';
        }
        if(empty(trim($this>datos['direcion'])) ){
            $this->respuesta['msg']='Por favor ingrese el direccion';
            
        }
        if(empty(trim($this>datos['telefono'])) ){
            $this->respuesta['msg']='Por favor ingrese el telefono';
            
        }
        if(empty(trim($this>datos['dui'])) ){
            $this->respuesta['msg']='Por favor ingrese el dui';
        }
        
        
        
    })
    private function almacenar_datos(){
        
    }
}
?>