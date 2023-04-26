## VCLASS BACKEND

### OVERVIEW
A web server for a classroom management platform called **VCLASS**.

### DEPENDENCIES
- Node.js
- Express.js
- Mongoose
- Express Validator
- JWT
- Passport.js
- Socket.io

### TODO
- [ ] Portal 
  - [ ] Create Model
  - [ ] Create Controllers
  - [ ] Creat Routes

### ISSUES
- [ ] Body Validation
  - [ ] Check if the name of faculty already exists or not
    - [x] While Creating
    - [ ] While Updating 
  - [ ] Check if the year and facultyName of batch is same or not
    - [x] While Creating
    - [ ] While Updating
  - [x] Check the currentSemester of batch whether it extends the length of faculty's semesters
- [ ] User Registration
  - [ ] Check email & Assign role, college, batch, faculty