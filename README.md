# Ageless Living™

Full-stack wellness clinic platform built with ASP.NET Core, Blazor, SQL Server, and AI-driven features.

---

## 🚀 Tech Stack

* **Frontend:** Blazor (Static SSR + Interactive Server)
* **Backend:** ASP.NET Core (.NET 10)
* **Database:** SQL Server + Entity Framework Core
* **Styling:** Tailwind CSS
* **Background Jobs:** Hangfire
* **Logging:** Serilog
* **AI/ML:** ONNX Runtime + ML.NET
* **Payments:** Square
* **Hosting:** IIS (Windows Server)

---

## 🧰 First-Time Setup (Run Once)

### 1. Install (in order)

1. .NET SDK (LTS, version 10)
2. Node.js (LTS)
3. SQL Server (Express or Developer)
4. SQL Server Management Studio (SSMS)

---

### 2. Install VS Code Extensions

* C# Dev Kit
* .NET Install Tool
* Tailwind CSS IntelliSense
* ESLint

---

### 3. Install EF Core CLI

Run after installing .NET SDK:

```bash
dotnet tool install --global dotnet-ef
```

---

### 4. Verify Installation

```bash
dotnet --version
dotnet ef --version
node -v
npm -v
sqlcmd -?
```

If all commands return versions, setup is complete.

---

## 🏗️ Project Setup

Clone the repository:

```bash
git clone https://github.com/your-username/Ageless.git
cd Ageless
```

---

## ⚙️ Run the Project

```bash
dotnet build
dotnet run --project src/AgelessLiving.Web
```

Then open:

```
https://localhost:5001
```

---

## 🗄️ Database Setup

Run migrations:

```bash
dotnet ef database update
```

---

## 🎨 Tailwind Build

Tailwind is compiled automatically during build.

If needed manually:

```bash
cd src/AgelessLiving.Web
npx tailwindcss -i ./Styles/app.css -o ./wwwroot/css/site.css --minify
```

---

## 📁 Project Structure

```
src/
├── AgelessLiving.Web            # Frontend (Blazor)
├── AgelessLiving.Core           # Domain models
├── AgelessLiving.Infrastructure # Data + EF Core
├── AgelessLiving.Booking        # Booking logic
├── AgelessLiving.Commerce       # Payments + products
├── AgelessLiving.Content        # Blog + CMS
├── AgelessLiving.AI             # AI/ML logic
├── AgelessLiving.Marketing      # Email/SMS campaigns
```

---

## 📌 Development Workflow

1. Follow phases defined in the build prompt
2. Complete Phase 0 before moving forward
3. Do not skip phases
4. Always ensure project builds before continuing

---

## 🧠 Notes

* Jane App has **no API** → use embed links only
* All prices in **CAD**
* Timezones: display in Pacific, store in UTC
* AI runs **locally (no cloud dependency)**

---

## ✅ Status

* Phase 0: Setup
* Phase 1: UI Build
* Phase 2+: In Progress

---

## 📄 License

Private project. All rights reserved.
