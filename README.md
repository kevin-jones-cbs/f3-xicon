# F3 Xicon Hackathon Submission

## Overview

This is my submission for the F3 Nation Xicon Hackathon. The project is a fully functional web application built with Next.js and hosted on Google Cloud Platform (GCP). It provides a permanent, modern, and easy-to-use home for both the Exicon (F3 workouts) and the Lexicon (F3 glossary). It features mobile-friendly responsive design, intuitive search and filtering, and a robust admin interface.

Both the Exicon and Lexicon are integrated into a unified UI and codebase with shared features and styles. The system uses PostgreSQL on the backend and NextAuth for authentication. It's designed with future maintainability and integration into F3 Nation's existing systems in mind.

---

## Demo

- [Exicon](https://next-app-116475879153.us-west1.run.app/exicon)
- [Lxicon](https://next-app-116475879153.us-west1.run.app/lexicon)
- [Admin Signin](https://next-app-116475879153.us-west1.run.app/login) (Password provided in submission)

## Key Features

### ✅ Core Requirements Implemented

* **Exicon and Lexicon support** with unified UI and data model
* **Search across name, description, and aliases**
* **Alias support** with metadata stored per entry
* **CSV export** of all entries or just filtered results
* **Mobile and desktop friendly** layout
* **NextAuth authentication** with support for integrating into existing F3 login systems
* **Unauthenticated user submissions** with approval workflow
* **Admin interface** to view, approve, reject, and edit submissions
* **Tag support and filtering** with AND/OR logic
* **Embedded video support** (e.g., YouTube links)
* **Reference links** between related entries (e.g., Abe Vigoda references Van Goghda). Inline modal shows definition of linked entry(s).

### ✨ Extra Features

* **Notification banner for admins** showing count of pending submissions
* **Inline editing of entries before approval** including a searchable exercise database for tagging related exicon entries
* **Support for submitting F3 Name and Region** during submission, visible to admins
* **Starring/favoriting workouts**, persistently stored, as a way to plan future Qs

---

## Future Improvements

* Add **vector search** to search for "animal exercises" or "exercises based on movies"
* Add **dynamic routing** for SEO 

---

## Tech Stack

* **Next.js** 
* **PostgreSQL** (deployed on GCP)
* **NextAuth** for authentication
* **Tailwind CSS** for styling
* **Deployed to Google Cloud Run**

---

---

## Screenshots

### Main Functionality

<img width="450" alt="Image" src="https://github.com/user-attachments/assets/04e89ecf-0246-4bf0-ba95-d94a38ef7cbc" />

<img width="450" alt="Image" src="https://github.com/user-attachments/assets/05aa3b7e-cca8-4778-a808-c6aecd498f73" />

<img width="450" alt="Image" src="https://github.com/user-attachments/assets/db121cf6-1c5e-470b-8bd9-2f38abc60072" />

<img width="450" alt="Image" src="https://github.com/user-attachments/assets/16533007-0f8c-4af5-858e-c153197df6dd" />

### Submissions/Admin Mode

<img width="450" alt="Image" src="https://github.com/user-attachments/assets/3de4a8ad-5177-4b1c-96eb-43863508d766" />

<img width="450" alt="Image" src="https://github.com/user-attachments/assets/d6d31267-c7fa-467d-8009-c233942a37cc" />

<img width="450" alt="Image" src="https://github.com/user-attachments/assets/ec9e806c-65c6-4466-a8c8-8652972b3a60" />

<img width="450" alt="image" src="https://github.com/user-attachments/assets/4c937f29-7463-47d9-9bd2-914fc9df686a" />

### Exercise Tagging

<img width="450" alt="image" src="https://github.com/user-attachments/assets/638863f7-ab8d-4bfa-b8e2-418957382827" />

<img width="450" alt="image" src="https://github.com/user-attachments/assets/678d786b-a005-4f35-8849-4b10606e3e7b" />

---

## License & Ownership

This submission is made in accordance with the hackathon's legal terms. All code is open source and owned by F3 Nation. Significant contributors and creators will be listed in the main GitHub repository if this entry is selected.

---

## Author

**Kevin Jones**

F3 Name: *Peacock*

F3 Region: *South Fork*
