# Laboratorio 3: cola de eventos y prioridad

Cola ordenada por prioridad descendente, con orden de llegada estable y despacho cooperativo mediante `setImmediate`. El Event Loop puede atender timers y otras operaciones entre tareas.

## Requisito

- Node.js 20 o superior.

## Ejecucion

Desde esta carpeta:

```powershell
npm start
```

La demostracion agrega 50 tareas de baja prioridad e inyecta tres tareas VIP mientras la cola sigue activa. Para reproducir la carga de 5000 reportes del PDF y la llegada VIP a los 2 segundos:

```powershell
npm run stress
```

Cada tarea simula un tramo CPU acotado (0,5 ms en modo normal y 1 ms en modo estres); el bucle cede el control con `setImmediate` antes de continuar. La prioridad solo puede alterar las tareas que siguen en la cola; no interrumpe una tarea que ya comenzo. El modo de estres tarda varios segundos y mantiene cada tramo individual corto para que timers y otras operaciones sigan teniendo oportunidad de ejecutarse.

## Pruebas

```powershell
npm test
```