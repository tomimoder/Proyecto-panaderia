# Sistema de Gestión de Pedidos - Pastelería

## Descripción del Proyecto

Sistema web desarrollado para la gestión integral de pedidos de una pastelería. Este proyecto nace de la necesidad de digitalizar y organizar el proceso de registro, seguimiento y administración de pedidos, reemplazando métodos manuales por una solución moderna y eficiente.

El objetivo principal fue crear una aplicación práctica que no solo resuelva un problema real, sino que también sirva como experiencia de aprendizaje en el desarrollo full-stack de aplicaciones web modernas.

## Características Principales

- **Registro de Pedidos**: Formulario intuitivo para crear nuevos pedidos con validación de datos
- **Dashboard de Estadísticas**: Visualización de métricas clave (ventas, pedidos pendientes, productos más vendidos)
- **Gestión de Pedidos**: Visualización, filtrado y búsqueda de pedidos por fecha, estado o cliente
- **Actualización de Estados**: Cambio de estado entre pendiente, entregado y cancelado
- **Análisis de Ventas**: Gráficos de ventas de los últimos 7 días y distribución por estado
- **Interfaz Moderna**: Diseño responsive
- **Notificaciones**: Feedback visual mediante toasts para todas las acciones

## Tecnologías Utilizadas

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (React)
- **Lenguaje**: JavaScript (JSX) / TypeScript
- **Estilos**: 
  - [Tailwind CSS](https://tailwindcss.com/)
  - [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- **Gráficos**: [Recharts](https://recharts.org/)
- **Gestión de Estado**: React Context API
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Notificaciones**: [React Hot Toast](https://react-hot-toast.com/)

### Backend
- **Framework**: [Django 5.x](https://www.djangoproject.com/)
- **Lenguaje**: Python
- **API**: [Django REST Framework](https://www.django-rest-framework.org/)
- **Base de Datos**: SQLite (desarrollo) / PostgreSQL (producción recomendada)

## Estructura del Proyecto

```
├── Backend/
│   └── backend_pasteleria/
│       ├── backend_pasteleria/          # Configuración del proyecto Django
│       │   ├── settings.py
│       │   ├── urls.py
│       │   └── wsgi.py
│       ├── dashboard_backend_pasteleria/ # App principal
│       │   ├── migrations/
│       │   ├── models.py                # Modelo Order
│       │   ├── serializer.py            # Serializador de pedidos
│       │   ├── views.py                 # ViewSet de la API
│       │   └── admin.py                 # Panel de administración
│       └── manage.py
│
├── Frontend/
│   ├── app/
│   │   ├── nuevo-pedido/               # Página de creación de pedidos
│   │   ├── pedidos/                    # Página de listado de pedidos
│   │   ├── layout.tsx                  # Layout principal
│   │   └── page.jsx                    # Dashboard (página principal)
│   ├── components/
│   │   ├── ui/                         # Componentes de shadcn/ui
│   │   ├── Dashboard.jsx               # Componente de estadísticas
│   │   ├── OrderCard.jsx               # Tarjeta de pedido individual
│   │   ├── OrderForm.jsx               # Formulario de creación
│   │   ├── OrderList.jsx               # Lista de pedidos
│   │   └── Sidebar.jsx                 # Menú lateral de navegación
│   └── context/
│       └── OrderContext.jsx            # Contexto global de pedidos
│
└── README.md
```

## Instalación y Configuración

### Prerrequisitos
- Node.js 18+ y npm/pnpm
- Python 3.10+
- pip (gestor de paquetes de Python)

### Backend (Django)

1. **Navegar al directorio del backend**:
```bash
cd Backend/backend_pasteleria
```

2. **Crear y activar entorno virtual**:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. **Instalar dependencias**:
```bash
pip install django djangorestframework django-cors-headers
```

4. **Aplicar migraciones**:
```bash
python manage.py migrate
```

5. **Crear superusuario (opcional)**:
```bash
python manage.py createsuperuser
```

6. **Iniciar servidor de desarrollo**:
```bash
python manage.py runserver
```

El backend estará disponible en `http://127.0.0.1:8000`

### Frontend (Next.js)

1. **Navegar al directorio del frontend**:
```bash
cd Frontend
```

2. **Instalar dependencias**:
```bash
npm install
# o
pnpm install
```

3. **Iniciar servidor de desarrollo**:
```bash
npm run dev
# o
pnpm dev
```

El frontend estará disponible en `http://localhost:3000`

## Modelo de Datos

### Tabla: `orders`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID/String | Identificador único |
| `customer_name` | String | Nombre del cliente |
| `phone` | String | Teléfono de contacto |
| `product` | String | Nombre del producto |
| `quantity` | Integer | Cantidad solicitada |
| `price` | Decimal | Precio unitario |
| `delivery_date` | Date | Fecha de entrega programada |
| `delivered_at` | DateTime | Fecha real de entrega |
| `notes` | Text | Notas adicionales (opcional) |
| `status` | Enum | Estado: `pendiente`, `entregado`, `cancelado` |
| `created_at` | DateTime | Fecha de creación |
| `updated_at` | DateTime | Última actualización |

## API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/orders/` | Listar todos los pedidos |
| `POST` | `/api/v1/orders/` | Crear nuevo pedido |
| `GET` | `/api/v1/orders/{id}/` | Obtener pedido específico |
| `PATCH` | `/api/v1/orders/{id}/` | Actualizar pedido |
| `DELETE` | `/api/v1/orders/{id}/` | Eliminar pedido |

## Reglas de Negocio

1. **Estados de Pedidos**:
   - Los pedidos comienzan en estado `pendiente`
   - Solo los pedidos pendientes pueden cambiar de estado
   - Los pedidos `entregados` o `cancelados` no se pueden modificar ni eliminar

2. **Estadísticas**:
   - El gráfico de ventas muestra ingresos de pedidos entregados
   - Los ingresos se calculan basados en la fecha real de entrega (`delivered_at`)
   - Solo se cuentan pedidos con estado `entregado` para las métricas financieras

3. **Validaciones**:
   - Todos los campos son obligatorios excepto `notes`
   - La cantidad debe ser mayor a 0
   - El precio debe ser positivo

## Mejoras Futuras

- [ ] Autenticación y autorización de usuarios
- [ ] Sistema de inventario de productos
- [ ] Gestión de clientes recurrentes
- [ ] Reportes de ventas en PDF
- [ ] Notificaciones por correo/WhatsApp
- [ ] Sistema de pagos y adelantos
- [ ] Calendario de entregas
- [ ] Aplicación móvil

## Autor

Desarrollado como proyecto de aprendizaje y crecimiento profesional en desarrollo full-stack.


## Contacto

Para preguntas, sugerencias o reportar problemas, por favor abre un issue en el repositorio.




