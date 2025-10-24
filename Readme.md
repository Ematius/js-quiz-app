🧠 JS Quiz App

JS Quiz App es una aplicación educativa interactiva diseñada para aprender y practicar métodos de JavaScript (Array y String) mediante un sistema de preguntas y niveles inspirados en un entorno tipo juego.

El proyecto está dividido en dos partes:

Backend: construido con NestJS y Prisma ORM.

Frontend: desarrollado con Angular 19 (standalone, Signals, @if/@for).

🔗 Prueba la app aquí:
👉 https://frontend-production-f433.up.railway.app/

🎯 Objetivo

El objetivo principal es ayudar a los estudiantes y programadores a aprender JavaScript de forma práctica, resolviendo ejercicios que refuerzan la teoría.
Cada respuesta actualiza el progreso del usuario y muestra una explicación educativa del método correspondiente.

⚙️ Funcionalidades principales

✅ Registro y autenticación de usuarios con JWT.

✅ Práctica de preguntas por método y nivel de dificultad.

✅ Guardado de progreso (user_progress) con cálculo automático de aciertos y totales.

✅ Sistema de favoritos con relación N:M (user_question_favorite).

✅ Respuestas inmediatas con explicación teórica.

✅ API REST estructurada por capas (controller, service, repository, dto).

✅ Base de datos relacional gestionada con Prisma.

✅ Frontend moderno con Angular Signals y estructura limpia por componentes.

✅ Proyecto 100% desplegado y funcional en Railway.

🧩 Estructura del proyecto

js-quiz-app/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── question/
│   │   │   └── user/
│   │   ├── prisma/
│   │   ├── main.ts
│   │   └── app.module.ts
│   ├── prisma/schema.prisma
│   ├── package.json
│   └── ...
│
└── frontend/
    ├── src/app/
    │   ├── core/
    │   ├── pages/
    │   └── components/
    ├── angular.json
    ├── package.json
    └── ...


🧮 Modelos de base de datos (Prisma)

User

id, email, password

relación con UserProgress y Favorite

Question

id, method_name, method_type, question_text, correct_answer, difficulty

UserProgress

user_id, question_id, is_correct (unique [user_id, question_id])

Favorite

relación N:M entre usuarios y preguntas


🚀 Tecnologías utilizadas

Backend

    NestJS

    Prisma ORM

    MySQL

    JWT

    REST API

    Class Validator / Transformer

Frontend

    Angular 19 (standalone components)

    Signals

    SCSS modular

    TypeScript

🧠 Aprendizaje y propósito

Este proyecto forma parte de mi proceso de aprendizaje para dominar JavaScript, NestJS, Angular y Prisma aplicados a un entorno real de desarrollo full stack.
Combina buenas prácticas, arquitectura limpia y un enfoque pedagógico para hacer del aprendizaje de JavaScript una experiencia interactiva y divertida.


📦 Estado del proyecto

✅ Backend completo y conectado a base de datos
✅ API funcional con rutas /question, /auth, /progress, /favorite
✅ Frontend Angular totalmente operativo
✅ Desplegado en Railway: https://frontend-production-f433.up.railway.app/
