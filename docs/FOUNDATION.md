# MindOS — Documento Fundacional

## El problema que resuelve
Los sistemas actuales de pensamiento asistido por IA son inseguros, centralizados y no respetan la privacidad intelectual del usuario. MindOS proporciona un espacio de trabajo completamente privado, auto-soberano y auditado donde el usuario controla al 100% sus ideas, datos y procesos cognitivos.

## Qué DEBE hacer el sistema
- Permitir crear proyectos y cuadernos jerárquicos para organizar el conocimiento
- Ofrecer un chat multi-modelo con streaming de respuestas y panel de artifacts
- Proporcionar un canvas visual interactivo tipo Miro para mapear ideas
- Implementar un sistema de fuentes (PDFs, URLs) con RAG integrado tipo NotebookLM
- Ejecutar "The Council": un sistema multi-agente que analiza ideas desde múltiples perspectivas con streaming visible
- Gestionar API keys de forma segura con cifrado AES-256-GCM y almacenamiento en Vault
- Autenticación robusta con MFA obligatorio y control de sesiones por dispositivo
- Interfaz de voz para entrada y salida de audio
- Visualizaciones 3D y mapas conceptuales generados por IA

## Qué NO debe hacer (límites explícitos)
- No debe enviar datos a servicios externos sin consentimiento explícito del usuario
- No debe almacenar información del usuario en servidores de terceros sin cifrado
- No debe incluir tracking, analytics o cualquier forma de telemetría
- No debe depender de dependencias de terceros no auditables o de código cerrado para funciones críticas
- No debe permitir acceso a datos sin autenticación multifactor

## Flujo lógico principal
1. El usuario inicia sesión con email, contraseña y código TOTP (MFA obligatorio)
2. Accede a su workspace personal con lista de proyectos y cuadernos
3. Dentro de un cuaderno puede:
   - Chatear con diferentes modelos de IA usando sus propias keys
   - Crear y editar múltiples canvas visuales con nodes, sticky notes y conexiones
   - Subir fuentes (PDFs, URLs) que se procesan para RAG
   - Activar "The Council" para analizar ideas importantes con múltiples perspectivas
4. Las API keys se gestionan desde un panel de configuración seguro con cifrado
5. Se puede revocar el acceso por dispositivo desde la configuración
6. Todo el contenido se almacena cifrado y con acceso solo por el usuario autenticado

## Definición de éxito
MindOS está completo cuando el usuario puede trabajar con su conocimiento e ideas de forma completamente privada, usando IA como co-piloto seguro. Debe poder:
- Organizar todo su conocimiento en proyectos y cuadernos
- Visualizar ideas complejas en canvas interactivos
- Chatear con múltiples modelos manteniendo el contexto
- Analizar problemas desde múltiples ángulos con The Council
- Investigar temas con fuentes documentales y RAG
- Mantener el control total sobre sus datos y keys
- Acceder desde dos dispositivos con seguridad garantizada

## Módulos identificados (orden de construcción)
1. Autenticación completa con MFA y gestión de dispositivos
2. Configuración segura de API keys con cifrado AES-256-GCM
3. Sistema de chat multi-modelo con streaming y panel de artifacts
4. Gestión de contexto continuo con resúmenes automáticos
5. The Council - sistema multi-agente secuencial con streaming
6. Canvas interactivo con Konva.js
7. Módulo de investigación con RAG y pgvector
8. Interfaz de voz y visualizaciones 3D