# Host-Maker

Host-Maker for Growtopia Private Server (GTPS). This web application allows users to create and manage host files for connecting to private Growtopia servers. It utilizes Vercel Blob for storage to keep host data persistent.

## Features

- **Create Hosts**: Generate custom host files pointing to specific IP addresses (IP1 and optional IP2).
- **Secure Updates**: Update existing host files using a security key defined during creation.
- **Direct Access**: Get direct links to raw host file content.
- **User Interface**: Simple web interface for easy interaction.

## Deployment

### Deploy to Vercel

This project is optimized for deployment on Vercel.

1. **Fork the Repository**: Fork this repository to your GitHub account.
2. **Create Vercel Project**: Log in to Vercel and create a new project by importing your forked repository.
3. **Configure Storage**:
   - Once the project is created, go to the **Storage** tab in your Vercel project dashboard.
   - Click **Create Database** and select **Blob**.
   - Follow the instructions to create and connect the Blob store to your project. This will automatically add the necessary environment variables (`BLOB_READ_WRITE_TOKEN`).
   - **Note**: If prompted, ensure to select **Public** access, since we use public storage.
4. **Redeploy**: If the environment variables weren't present during the initial build, you may need to redeploy via the Deployments tab.

### Local Development

To run this project locally, you need Node.js installed and a Vercel project set up to access the Blob storage.

1. **Clone the repository**
   ```bash
   git clone https://github.com/GTPSHAX/Host-Maker.git
   cd Host-Maker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   To make the Vercel Blob storage work locally, you need to link your local environment to your Vercel project.
   
   First, install the Vercel CLI globally if you haven't already:
   ```bash
   npm i -g vercel
   ```
   
   Then, link and pull the environment variables:
   ```bash
   vercel link
   vercel env pull .env.local
   ```

4. **Run the application**
   ```bash
   node index.js
   ```
   *Note: The application listens on port 80 by default. You may need administrative privileges (sudo/Administrator) to bind to this port, or you can modify `index.js` to use a different port (e.g., 3000).*

## API Usage

The application exposes endpoints to create and retrieve host data.

- **Create/Update**: `POST /api`
  - Body: `name`, `ip1`, `ip2` (optional), `key` (optional)
- **Retrieve**: `GET /:key`
  - Returns the generated host file content.

## License

ISC

## Credits

- **Author**: OxygenC
- **Community**: GrowPlus Community