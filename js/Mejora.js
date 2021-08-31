// Declaramos un arreglo donde guardar nuestros jugadores
var misRegistros = []; 

// Obtenemos nuestro elemento donde mostrar los jugadores
var registros = document.getElementById('registros');

// Creamos una clase llamada jugador con un constructor que reciba 3 párametros
class Item {

  constructor(item, material, ordercant, description, cmaterial, ltCa, dgip, hlitm) {
    this.item = item;
    this.material = material;
    this.ordercant = ordercant;
	this.description = description;
    this.cmaterial = cmaterial;
    this.ltCa = ltCa;
	this.dgip = dgip;
    this.hlitm = hlitm;
  }

}

// Función para crear nuestro jugador
function registrarItem() {
  // Obtenemos el nombre dado por el usuario
  var item = document.getElementById('item').value;
  // Obtenemos la edad dad por el usuario y la parseamos
  var material = document.getElementById('material').value;
  // Creamos nuestro jugador
  var ordercant = document.getElementById('ordercant').value;
    // Obtenemos el nombre dado por el usuario
  var description = document.getElementById('description').value;
  // Obtenemos la edad dad por el usuario y la parseamos
  var cmaterial = document.getElementById('cmaterial').value;
  // Creamos nuestro jugador
  var ltCa = document.getElementById('ltCa').value;
    // Obtenemos el nombre dado por el usuario
  var dgip = document.getElementById('dgip').value;
  // Obtenemos la edad dad por el usuario y la parseamos
  var hlitm = document.getElementById('hlitm').value;
	
  var itemC = new Item(item, material, ordercant, description, cmaterial, ltCa, dgip, hlitm);
	
  // Lo añadimos a nuestro arreglo
  misRegistros.push(itemC);
  // Actualizamos nuestra tabla
  actualizarRegistro();
}

// Con esta función recorremos a todos nuestros jugadores
// en el arreglo anteriormente creado
// y los mostramos en la tabla
function actualizarRegistro() {
  // Limipamos la tabla para no repetir jugadores
  document.getElementById('registros').innerHTML = ''; 
  // Recorremos nuestros jugadores
  for (var i = 0; i < misRegistros.length; i++) {
    // Añadimos nuestros jugadores a la tabla
    document.getElementById('registros').innerHTML = document.getElementById('registros').innerHTML +
          '<tr>' +
              '<td>' + misRegistros[i].item + '</td>' +
              '<td>' + misRegistros[i].material + '</td>' +
              '<td>' + misRegistros[i].ordercant + '</td>' +
			  '<td>' + misRegistros[i].description + '</td>' +
			  '<td>' + misRegistros[i].cmaterial + '</td>' +
			  '<td>' + misRegistros[i].ltCa + '</td>' +
			  '<td>' + misRegistros[i].dgip + '</td>' +
			  '<td>' + misRegistros[i].hlitm + '</td>' +
          '</tr>';
  }
}