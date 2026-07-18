# Customer Support CRM

A production-ready but beginner-friendly Customer Support CRM system built with Python, FastAPI, SQLite, and vanilla JavaScript + HTML + Tailwind CSS.

## Features
- **Create Tickets**: Log issues with customer details and a description.
- **List & Filter**: View all tickets. Search by ID, name, email, or description. Filter by Status (Open, In Progress, Closed).
- **Dashboard Stats**: Quick summary cards showing total tickets and counts by status.
- **Ticket Details**: View the complete details of a specific ticket.
- **Update Tickets**: Change the status of a ticket and add internal notes/comments.

## Technology Stack
- **Backend**: FastAPI (Python), SQLAlchemy (ORM), Pydantic (Validation)
- **Database**: SQLite (No external setup required)
- **Frontend**: HTML5, Vanilla JavaScript (Fetch API), Tailwind CSS (via CDN)
- **Templating**: Jinja2

## Local Setup Instructions

1. **Clone the repository** (or download the files)
2. **Create a virtual environment (recommended)**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
4. **Environment Variables (Optional)**
   Copy `.env.example` to `.env` if you want to customize settings. By default, it uses a local SQLite database named `crm.db`.
   ```bash
   cp .env.example .env
   ```
5. **Run the application**
   ```bash
   python run.py
   ```
   Or using Uvicorn directly:
   ```bash
   uvicorn app.main:app --reload
   ```
6. **Access the Application**
   Open your browser and navigate to `http://localhost:8000`

## Deployment on Railway

This app is ready to deploy on [Railway](https://railway.app/). Railway natively supports Python.

1. Create a GitHub repository and push your code.
2. Go to Railway, create a new project, and select "Deploy from GitHub repo".
3. Railway will detect the `requirements.txt` and install the dependencies.
4. Set the Start Command for the service to:
   ```bash
   python run.py
   ```
   *(The `run.py` script automatically listens on the `PORT` environment variable provided by Railway).*
5. The SQLite database will be created on the disk. *Note: If you are using a stateless environment like Railway's default containers without a persistent volume, the SQLite database might reset on redeploy. For production, consider provisioning a PostgreSQL database on Railway and changing the `DATABASE_URL` environment variable.*
