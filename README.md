**Objective:**
Create an assignment submission portal with the following functionality and structure.

### Scenario:

You are tasked with developing a backend system for an assignment submission portal. The system should support users and admins where:

- **Users** can upload assignments.
    - Assignments in this case can just be an object like below
        
        ```json
        {
            'task': 'Hello World',
            'adminEmail': 'alok@gmail.com',
        }
        ```
        
- **Admins** can accept or reject these assignments.
    - Admin can see all assignments tagged to them
    - Admins will see each the user name, task and timedate data
    - Admin can either reject or accept them

### Requirements:

1. **Database:**
    - Use MongoDB as your database.
2. **Structure and Functionality:**
    - There should be two types of users: **Admin** and **User**.
    - **Users** can:
        - Register and log in.
        - Upload assignments.
    - **Admins** can:
        - Register and log in.
        - View assignments tagged to them.
        - Accept or reject assignments.
3. **Endpoints:**
    - **User Endpoints:**
        - `POST /register` - Register a new user.
        - `POST /login` - User login.
        - `POST /upload` - Upload an assignment.
        - `GET /admins`- fetch all admins
    - **Admin Endpoints:**
        - `POST /register` - Register a new admin.
        - `POST /login` - Admin login.
        - `GET /assignments` - View assignments tagged to the admin.
        - `POST /assignments/:id/accept` - Accept an assignment.
        - `POST /assignments/:id/reject` - Reject an assignment.
