# DemocraChain DAO

DemocraChain DAO es una plataforma de gobierno abierto y transparente basada en blockchain, donde una organización puede proporcionar un presupuesto y una DAO puede proponer, votar y ejecutar proyectos de manera descentralizada y auditable.

---

## 🚀 Características principales
- Organización con presupuesto: Una wallet puede depositar fondos (tokens) en el contrato inteligente.
- DAO de proyectos: Los miembros pueden proponer proyectos, votar y ejecutar propuestas.
- Votación transparente: Todo el proceso de votación y ejecución es público y auditable en la blockchain.
- Frontend moderno: Interfaz web para crear propuestas, votar y ver el estado de los proyectos en tiempo real.
- Integración con MetaMask: Los usuarios pueden conectar su wallet y participar directamente desde el navegador.

---

## 📦 Estructura del proyecto

```
Hackaton/
├── contracts/                # Contratos inteligentes y scripts de despliegue
│   ├── contracts/
│   │   ├── OpenBudgetDAO.sol
│   │   └── ERC20Mock.sol
│   ├── scripts/
│   │   └── deploy.js
│   └── artifacts/            # ABI y bytecode generados por Hardhat
├── js/
│   └── app.js                # Lógica principal del frontend
├── index.html                # Página principal
├── proyectos.html            # Página de proyectos
├── votaciones.html           # Página de votaciones (opcional)
├── transparencia.html        # Página de transparencia (opcional)
└── package.json              # Dependencias de Node.js
```

---

## ⚙️ Instrucciones de instalación y uso

### 1. Clona el repositorio y entra al directorio
```bash
git clone <repo-url>
cd Hackaton
```

### 2. Instala las dependencias de Node.js
```bash
cd contracts
npm install
```

### 3. Inicia el nodo local de Hardhat
```bash
npx hardhat node
```

### 4. Despliega los contratos en la red local
En otra terminal:
```bash
npx hardhat run scripts/deploy.js --network localhost
```
Copia la dirección que te da el despliegue (por ejemplo, `0xABCDEF...`).

### 5. Actualiza la dirección del contrato en el frontend
En los archivos `index.html`, `proyectos.html`, `js/app.js`, etc., reemplaza la dirección en:
```js
const openBudgetDaoAddress = "DIRECCION_DEL_CONTRATO";
```
por la dirección que copiaste del despliegue.

### 6. Inicia un servidor web para el frontend
Desde la raíz del proyecto:
```bash
python3 -m http.server 8080
```
Abre tu navegador en: [http://localhost:8080/index.html](http://localhost:8080/index.html)

---

## 🦊 Conecta MetaMask
1. Instala la extensión de MetaMask en tu navegador.
2. Selecciona la red `localhost 8545` o `Hardhat Network`.
3. Importa una de las cuentas generadas por Hardhat usando su clave privada (aparece en la terminal al iniciar el nodo).
4. Usa esa cuenta para interactuar con la dApp.

---

## 🛠️ Funcionalidades del frontend
- **Conectar wallet:** Botón para conectar MetaMask.
- **Crear propuesta:** Formulario para proponer nuevos proyectos.
- **Votar:** Botones para votar a favor o en contra de propuestas.
- **Ejecutar propuesta:** Botón para ejecutar propuestas aprobadas.
- **Ver proyectos:** Listado dinámico de proyectos y su estado real en la blockchain.

---

## 📝 Notas importantes y solución de problemas
- Si reinicias el nodo de Hardhat, **debes volver a desplegar el contrato** y actualizar la dirección en el frontend.
- El ABI del contrato debe coincidir con el contrato desplegado.
- Usa solo cuentas y fondos de prueba en la red local.
- Si MetaMask no conecta, asegúrate de estar en la red local y de abrir la dApp desde `http://localhost:8080/`.
- Si no ves fondos en MetaMask, importa una cuenta de Hardhat usando la clave privada que aparece en la terminal.
- Si ves errores de ABI o dirección, revisa que la dirección y el ABI sean los correctos y estén actualizados en todos los archivos.

---

## 📄 Licencia
MIT

---

## 📋 Instrucciones rápidas para cada ventana

### index.html
- Página principal, conecta la wallet y muestra el estado general.
- Permite crear propuestas y ver el estado de la wallet.

### proyectos.html
- Muestra todos los proyectos reales desde la blockchain.
- Permite votar y ver detalles de cada proyecto.

### votaciones.html (opcional)
- Puedes adaptar la lógica de proyectos.html para mostrar solo propuestas en votación.

### transparencia.html (opcional)
- Puedes mostrar el historial de propuestas ejecutadas y eventos del contrato.
