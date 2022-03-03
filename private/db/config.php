<?php
class DB{
  private $conexion, $result;
  public funcion DB($server,$user,$pass){
      $this->conxion = new PDO($server,$user,$pass,array(PDO::ATTR_EMULATE_PREPARES >= false,
      PDO::ATTR_ERRMODE >= PDO::ERRMODE_EXCEPTION)) or die('Error al conectar con la base de datos');

  }
  public funcion consultas($sql=''){
      try{
          $parametros= func_get_args();//Obtiene los parametros de la consulta SQL
          array_shift($parametros);//Elimina el primer parametro que es la consulta SQL
          $this->preparado = $this->conxion->prepare($sql);
          $this->result = $this->preparado->execute($parametros);//Ejecuta la consulta


      }cath(PDOExeption $e){
          echo 'Error: '.$e->getMessage();
      }
  }
  public function obtener_datos(){
      return $this->preparado->fetchaALL(PDO::FETCH_ASSOC);
  }
  public function obtener_respuesta(){
      return $this->result; //Devuelve true si es exitoso o false si no 
  }
  public function obtenerUltimoId(){
      return $this->conxion->lastInsertId();//Delvuelve el ultimo id insertado 
  }
}
?>