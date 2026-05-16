# User Stories — Buildline Procurement Platform

> **Project:** Buildline — Plataforma de Gestión de Compras y Abastecimiento para MYPEs Constructoras
> **Author:** RQLS TEAM

---

## Epics

| EPIC ID | Titulo | Descripcion |
|--------|--------|-------------|
| EP-01 | Gestión de requerimientos | Permite registrar, visualizar, buscar y filtrar requerimientos de materiales desde obra, asegurando un flujo estructurado de solicitudes. |
| EP-02 | Gestión de compras y abastecimiento | Permite gestionar el proceso completo de compras: cotizaciones, comparación, aprobación y generación de órdenes de compra. |
| EP-03 | Gestión de inventario y almacén | Permite controlar el stock de materiales, registrar movimientos y confirmar la recepción de pedidos para mantener inventarios actualizados. |
| EP-04 | Gestión de usuarios y seguridad | Permite registrar usuarios, gestionar roles y controlar accesos al sistema mediante autenticación segura. |
| EP-05 | Análisis y control de gestión | Permite visualizar indicadores, historial de compras y control presupuestal para la toma de decisiones estratégicas. |
| EP-06 | Comunicación e integración | Permite enviar notificaciones, acceso móvil y exportación/importación de datos para mejorar la conectividad y usabilidad del sistema. |
| EP-07 | Gestión de proveedores | Permite registrar, evaluar y gestionar proveedores, así como controlar incidencias relacionadas con ellos. |

---

## EP-01: Gestión de Requerimientos

### US-001: Registrar requerimiento de material

**Como** ingeniero residente,

**Quiero** registrar un requerimiento de materiales desde obra,

**Para** iniciar el proceso de abastecimiento de forma estructurada.

<br>**Criterios de Aceptación:**

**Escenario 1: Registro correcto**

**Dado** que el usuario completa los campos obligatorios (material, cantidad, proyecto y prioridad),

**Cuando** envía el requerimiento,

**Entonces** el sistema registra el requerimiento con un ID único, estado "Pendiente" y fecha de registro.

**Escenario 2: Datos incompletos**

**Dado** que faltan campos obligatorios,

**Cuando** intenta enviar el requerimiento,

**Entonces** el sistema bloquea el registro y muestra mensajes específicos por campo.

---

### US-002: Adjuntar evidencia al requerimiento

**Como** ingeniero residente,

**Quiero** adjuntar fotos o documentos al requerimiento,

**Para** brindar mayor claridad sobre el material solicitado.

<br>**Criterios de Aceptación:**

**Escenario 1: Archivo válido**

**Dado** que el usuario adjunta archivos JPG, PNG o PDF menores a 10MB,

**Cuando** envía el requerimiento,

**Entonces** los archivos se almacenan correctamente y se vinculan al requerimiento.

**Escenario 2: Archivo inválido**

**Dado** que el archivo excede el tamaño o el formato permitido,

**Cuando** intenta cargarlo,

**Entonces** el sistema muestra un error indicando la restricción.

---

### US-003: Visualizar lista de requerimientos

**Como** analista de logística,

**Quiero** ver todos los requerimientos en una lista,

**Para** gestionarlos eficientemente.

<br>**Criterios de Aceptación:**

**Escenario 1: Lista con datos**

**Dado** que existen requerimientos registrados,

**Cuando** accede a la lista,

**Entonces** el sistema muestra los requerimientos en una tabla con filtros, ordenados por fecha y prioridad.

**Escenario 2: Sin datos**

**Dado** que no existen requerimientos registrados,

**Cuando** accede a la lista,

**Entonces** el sistema muestra el mensaje "No hay requerimientos registrados".

---

### US-004: Filtrar requerimientos

**Como** analista de logística,

**Quiero** filtrar requerimientos por estado o proyecto,

**Para** encontrarlos rápidamente.

<br>**Criterios de Aceptación:**

**Escenario 1: Filtro aplicado**

**Dado** que selecciona criterios como estado, proyecto o fecha,

**Cuando** aplica el filtro,

**Entonces** el sistema actualiza la lista mostrando solo las coincidencias.

**Escenario 2: Sin coincidencias**

**Dado** que no existen resultados que coincidan con los criterios,

**Cuando** aplica el filtro,

**Entonces** el sistema muestra un mensaje claro sin afectar la interfaz.

---

### US-026: Búsqueda global

**Como** analista de logística,

**Quiero** buscar información en el sistema,

**Para** encontrar datos rápidamente.

<br>**Criterios de Aceptación:**

**Escenario 1: Coincidencia encontrada**

**Dado** que existe información relacionada con el término buscado,

**Cuando** realiza la búsqueda,

**Entonces** el sistema muestra resultados categorizados.

**Escenario 2: Sin resultados**

**Dado** que no existen coincidencias,

**Cuando** ejecuta la búsqueda,

**Entonces** el sistema muestra un mensaje claro.

---

## EP-02: Gestión de Compras y Abastecimiento

### US-005: Generar solicitud de cotización

**Como** analista de logística,

**Quiero** generar solicitudes de cotización,

**Para** obtener precios de proveedores.

<br>**Criterios de Aceptación:**

**Escenario 1: Generación correcta**

**Dado** que el requerimiento está aprobado,

**Cuando** genera la solicitud de cotización,

**Entonces** el sistema crea un documento con los detalles del requerimiento y lo deja listo para enviarse a los proveedores.

**Escenario 2: Error de validación**

**Dado** que faltan datos obligatorios,

**Cuando** intenta generar la solicitud,

**Entonces** el sistema notifica qué campos deben completarse.

---

### US-006: Registrar cotizaciones

**Como** analista de logística,

**Quiero** registrar cotizaciones recibidas,

**Para** compararlas.

<br>**Criterios de Aceptación:**

**Escenario 1: Registro válido**

**Dado** que ingresa proveedor, precio y tiempo de entrega,

**Cuando** guarda la cotización,

**Entonces** la cotización queda asociada al requerimiento.

**Escenario 2: Datos incompletos**

**Dado** que faltan campos obligatorios,

**Cuando** intenta guardar,

**Entonces** el sistema impide el registro y muestra las validaciones correspondientes.

---

### US-007: Comparar cotizaciones

**Como** jefe de proyecto,

**Quiero** comparar cotizaciones,

**Para** elegir la mejor opción.

<br>**Criterios de Aceptación:**

**Escenario 1: Comparación disponible**

**Dado** que existen múltiples cotizaciones registradas,

**Cuando** accede a la comparación,

**Entonces** el sistema muestra una tabla comparativa con precio, tiempo de entrega y proveedor.

**Escenario 2: Sin cotizaciones**

**Dado** que no existen cotizaciones registradas,

**Cuando** accede a la comparación,

**Entonces** el sistema muestra un mensaje indicando la ausencia de datos.

---

### US-008: Aprobar compra

**Como** jefe de proyecto,

**Quiero** aprobar compras,

**Para** autorizar gastos dentro del sistema.

<br>**Criterios de Aceptación:**

**Escenario 1: Aprobación**

**Dado** que revisa una cotización,

**Cuando** aprueba la compra,

**Entonces** el sistema cambia el estado a "Aprobado" y continúa el proceso.

**Escenario 2: Rechazo**

**Dado** que decide rechazar la compra,

**Cuando** registra la decisión,

**Entonces** el sistema solicita un motivo y notifica a logística.

---

### US-009: Generar orden de compra

**Como** analista de logística,

**Quiero** generar órdenes de compra,

**Para** formalizar pedidos.

<br>**Criterios de Aceptación:**

**Escenario 1: Generación correcta**

**Dado** que la compra está aprobada,

**Cuando** genera la orden de compra,

**Entonces** el sistema crea un documento con código único y datos completos.

**Escenario 2: Error de validación**

**Dado** que existen inconsistencias en los datos,

**Cuando** intenta generar la orden,

**Entonces** el sistema alerta sobre las inconsistencias detectadas.

---

### US-011: Seguimiento de pedidos

**Como** ingeniero residente,

**Quiero** ver el estado de mis pedidos,

**Para** monitorear avances.

<br>**Criterios de Aceptación:**

**Escenario 1: Estado actualizado**

**Dado** que el pedido está en proceso,

**Cuando** consulta el seguimiento,

**Entonces** visualiza los estados (pendiente, enviado, entregado) con sus fechas correspondientes.

**Escenario 2: Sin datos**

**Dado** que no existen pedidos registrados,

**Cuando** consulta el seguimiento,

**Entonces** el sistema muestra un mensaje informativo.

---

## EP-03: Gestión de Inventario y Almacén

### US-012: Confirmar recepción de materiales

**Como** ingeniero residente,

**Quiero** confirmar la recepción de materiales,

**Para** cerrar pedidos correctamente.

<br>**Criterios de Aceptación:**

**Escenario 1: Confirmación**

**Dado** que recibe los materiales,

**Cuando** confirma la recepción,

**Entonces** el pedido pasa a "Completado" y se registra la fecha y el responsable.

**Escenario 2: Validación adicional**

**Dado** que falta validar información asociada al pedido,

**Cuando** intenta cerrar la recepción,

**Entonces** el sistema solicita una validación adicional antes de finalizar.

---

### US-014: Controlar stock

**Como** analista de logística,

**Quiero** ver el stock disponible,

**Para** evitar faltantes de materiales.

<br>**Criterios de Aceptación:**

**Escenario 1: Stock disponible**

**Dado** que existen materiales en almacén,

**Cuando** consulta el inventario,

**Entonces** el sistema muestra el stock actualizado por almacén y tipo de material.

**Escenario 2: Sin stock**

**Dado** que no existe stock disponible,

**Cuando** consulta el inventario,

**Entonces** el sistema muestra una alerta visual y una sugerencia de reposición.

---

### US-015: Actualizar stock

**Como** analista de logística,

**Quiero** actualizar el inventario,

**Para** mantener datos reales del almacén.

<br>**Criterios de Aceptación:**

**Escenario 1: Actualización correcta**

**Dado** que se registra ingreso o salida de materiales,

**Cuando** guarda el movimiento,

**Entonces** el stock se actualiza automáticamente.

**Escenario 2: Error de consistencia**

**Dado** que el movimiento genera inconsistencias,

**Cuando** intenta guardar,

**Entonces** el sistema evita el cambio y muestra la validación correspondiente.

---

## EP-04: Gestión de Usuarios y Seguridad

### US-022: Registro de usuarios

**Como** analista de logística,

**Quiero** registrar usuarios en el sistema,

**Para** permitir el acceso controlado.

<br>**Criterios de Aceptación:**

**Escenario 1: Registro válido**

**Dado** que el formulario contiene datos correctos,

**Cuando** registra el usuario,

**Entonces** el sistema lo crea con el rol asignado.

**Escenario 2: Datos inválidos**

**Dado** que los datos son incorrectos o incompletos,

**Cuando** intenta crear el usuario,

**Entonces** el sistema valida la información antes de guardar.

---

### US-023: Inicio de sesión

**Como** usuario,

**Quiero** iniciar sesión,

**Para** acceder al sistema.

<br>**Criterios de Aceptación:**

**Escenario 1: Credenciales correctas**

**Dado** que el usuario ingresa credenciales válidas,

**Cuando** inicia sesión,

**Entonces** accede al sistema correctamente.

**Escenario 2: Credenciales incorrectas**

**Dado** que el usuario ingresa credenciales inválidas,

**Cuando** intenta acceder varias veces,

**Entonces** el sistema bloquea el acceso tras múltiples intentos fallidos.

---

### US-024: Gestión de roles

**Como** jefe de proyecto,

**Quiero** gestionar roles,

**Para** controlar permisos dentro del sistema.

<br>**Criterios de Aceptación:**

**Escenario 1: Rol asignado**

**Dado** que selecciona un usuario y un rol,

**Cuando** guarda la asignación,

**Entonces** el sistema aplica los permisos correspondientes.

**Escenario 2: Error de validación**

**Dado** que la información es inconsistente,

**Cuando** intenta guardar el rol,

**Entonces** el sistema bloquea la acción y muestra el error.

---

### US-025: Historial de acciones

**Como** jefe de proyecto,

**Quiero** ver el historial de acciones,

**Para** auditoría del sistema.

<br>**Criterios de Aceptación:**

**Escenario 1: Logs visibles**

**Dado** que existen registros de actividad,

**Cuando** accede al historial,

**Entonces** se muestran los registros con usuario, fecha y acción.

**Escenario 2: Sin logs**

**Dado** que no existen registros,

**Cuando** accede al historial,

**Entonces** el sistema muestra un mensaje informativo.

---

## EP-05: Análisis y Control de Gestión

### US-016: Visualizar historial de compras

**Como** jefe de proyecto,

**Quiero** ver el historial de compras,

**Para** analizar decisiones pasadas.

<br>**Criterios de Aceptación:**

**Escenario 1: Historial visible**

**Dado** que existen compras registradas,

**Cuando** accede al historial,

**Entonces** se muestra una lista filtrable por fecha, proveedor y proyecto.

**Escenario 2: Historial vacío**

**Dado** que no existen compras registradas,

**Cuando** accede al historial,

**Entonces** el sistema muestra un mensaje informativo.

---

### US-017: Control presupuestal

**Como** jefe de proyecto,

**Quiero** ver el control de costos,

**Para** evitar sobrecostos en el proyecto.

<br>**Criterios de Aceptación:**

**Escenario 1: Datos actualizados**

**Dado** que el sistema cuenta con información financiera actualizada,

**Cuando** consulta el control presupuestal,

**Entonces** visualiza un dashboard con presupuesto vs. gasto real.

**Escenario 2: Error de datos**

**Dado** que existe inconsistencia en la información,

**Cuando** accede al control presupuestal,

**Entonces** el sistema muestra una alerta de inconsistencia.

---

### US-018: Alertas de sobrecosto

**Como** jefe de proyecto,

**Quiero** recibir alertas de sobrecostos,

**Para** prevenir desviaciones presupuestales.

<br>**Criterios de Aceptación:**

**Escenario 1: Exceso**

**Dado** que el gasto supera el umbral definido,

**Cuando** se registra la variación presupuestal,

**Entonces** el sistema envía una alerta automática.

**Escenario 2: Dentro del rango**

**Dado** que el gasto no supera el umbral,

**Cuando** se actualiza el presupuesto,

**Entonces** el sistema no genera alertas.

---

### US-019: Dashboard general

**Como** jefe de proyecto,

**Quiero** visualizar indicadores generales,

**Para** tomar decisiones rápidas.

<br>**Criterios de Aceptación:**

**Escenario 1: Dashboard cargado**

**Dado** que existen datos disponibles,

**Cuando** accede al dashboard,

**Entonces** se muestran KPIs como costos, pedidos y tiempos.

**Escenario 2: Sin datos**

**Dado** que no existen datos suficientes,

**Cuando** accede al dashboard,

**Entonces** el sistema muestra un mensaje informativo.

---

## EP-06: Comunicación e Integración

### US-010: Notificar al proveedor

**Como** analista de logística,

**Quiero** notificar al proveedor,

**Para** iniciar el proceso de entrega.

<br>**Criterios de Aceptación:**

**Escenario 1: Notificación exitosa**

**Dado** que existe una orden de compra,

**Cuando** envía la notificación,

**Entonces** el proveedor recibe un correo con los detalles de la orden.

**Escenario 2: Error de envío**

**Dado** que ocurre un fallo al enviar la notificación,

**Cuando** el sistema registra el intento fallido,

**Entonces** permite reenviar el mensaje.

---

### US-020: Acceso móvil

**Como** ingeniero residente,

**Quiero** acceder desde el móvil,

**Para** gestionar procesos desde obra.

<br>**Criterios de Aceptación:**

**Escenario 1: Acceso correcto**

**Dado** que el usuario accede desde un dispositivo móvil,

**Cuando** ingresa al sistema,

**Entonces** la interfaz se adapta correctamente y mantiene sus funciones principales.

**Escenario 2: Error de compatibilidad**

**Dado** que el navegador o dispositivo no es compatible,

**Cuando** intenta ingresar,

**Entonces** el sistema muestra un mensaje de compatibilidad.

---

### US-021: Notificaciones en tiempo real

**Como** usuario,

**Quiero** recibir notificaciones en tiempo real,

**Para** reaccionar rápidamente a eventos.

<br>**Criterios de Aceptación:**

**Escenario 1: Evento ocurre**

**Dado** que sucede un evento relevante en el sistema,

**Cuando** se registra el evento,

**Entonces** el sistema envía una notificación inmediata.

**Escenario 2: Error de entrega**

**Dado** que falla el envío de la notificación,

**Cuando** el sistema detecta el error,

**Entonces** reintenta automáticamente el envío.

---

### US-027: Integración con Excel

**Como** jefe de proyecto,

**Quiero** exportar datos a Excel,

**Para** realizar análisis externos.

<br>**Criterios de Aceptación:**

**Escenario 1: Exportación correcta**

**Dado** que existen datos disponibles para exportar,

**Cuando** solicita la exportación,

**Entonces** el sistema descarga un archivo Excel estructurado correctamente.

**Escenario 2: Error de exportación**

**Dado** que ocurre un problema durante el proceso,

**Cuando** se genera la exportación,

**Entonces** el sistema muestra un mensaje de fallo.

---

### US-028: Carga masiva de datos

**Como** analista de logística,

**Quiero** subir datos de forma masiva,

**Para** ahorrar tiempo en registros.

<br>**Criterios de Aceptación:**

**Escenario 1: Archivo válido**

**Dado** que el archivo cumple con la estructura requerida,

**Cuando** lo carga al sistema,

**Entonces** el sistema procesa la información y muestra un resumen de registros.

**Escenario 2: Error en archivo**

**Dado** que el archivo contiene errores,

**Cuando** intenta cargarlo,

**Entonces** el sistema genera un reporte de errores.

---

## EP-07: Gestión de Proveedores

### US-013: Registrar incidencias

**Como** ingeniero residente,

**Quiero** registrar problemas con proveedores,

**Para** llevar control de incidencias.

<br>**Criterios de Aceptación:**

**Escenario 1: Registro**

**Dado** que detecta un problema con un proveedor,

**Cuando** registra la incidencia con evidencia,

**Entonces** queda guardada con estado "Abierta" y asociada al pedido.

**Escenario 2: Error de validación**

**Dado** que faltan campos obligatorios,

**Cuando** intenta registrar la incidencia,

**Entonces** el sistema valida la información antes de guardar.

---

### US-029: Gestión de proveedores

**Como** analista de logística,

**Quiero** registrar proveedores,

**Para** tener una base de datos organizada.

<br>**Criterios de Aceptación:**

**Escenario 1: Registro correcto**

**Dado** que el formulario contiene información completa,

**Cuando** registra el proveedor,

**Entonces** el sistema guarda el proveedor correctamente.

**Escenario 2: Error de validación**

**Dado** que faltan datos obligatorios,

**Cuando** intenta guardar el proveedor,

**Entonces** el sistema valida la información antes de confirmar.

---

### US-030: Evaluación de proveedores

**Como** jefe de proyecto,

**Quiero** calificar proveedores,

**Para** mejorar decisiones futuras.

<br>**Criterios de Aceptación:**

**Escenario 1: Evaluación guardada**

**Dado** que completa la calificación del proveedor,

**Cuando** guarda la evaluación,

**Entonces** queda visible en el historial.

**Escenario 2: Error de validación**

**Dado** que faltan campos obligatorios,

**Cuando** intenta guardar,

**Entonces** el sistema valida la información antes de almacenar la evaluación.
