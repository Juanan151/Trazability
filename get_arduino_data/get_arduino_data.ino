#include <Arduino_MKRGPS.h>

void setup() {
  Serial.begin(9600);  // Inicializa la comunicación Serial a 9600 baudios
  while (!Serial);  // Espera hasta que el puerto Serial esté disponible

  if (!GPS.begin()) {  // Intenta inicializar el módulo GPS
    Serial.println("ERROR");
    while (1);  // Si falla, entra en un bucle infinito
  }
}

void loop() {
  if (GPS.available()) {  // Verifica si hay nuevos datos GPS
    float latitude   = GPS.latitude();
    float longitude  = GPS.longitude();

    // Enviar datos en formato CSV
    Serial.print(",x,x,");
    Serial.print(latitude, 7);
    Serial.print(",");
    Serial.print(longitude, 7);
    Serial.print(",");
    Serial.println("x");
    
    delay(60000); 
  }
}
