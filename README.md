# F3 Xicon Hackathon Submission

## Overview

This is my submission for the F3 Nation Xicon Hackathon. The project is a fully functional web application built with Next.js and hosted on Google Cloud Platform (GCP). It provides a permanent, modern, and easy-to-use home for both the Exicon (F3 workouts) and the Lexicon (F3 glossary). It features mobile-friendly responsive design, intuitive search and filtering, and a robust admin interface.

Both the Exicon and Lexicon are integrated into a unified UI and codebase with shared features and styles. The system uses PostgreSQL on the backend and NextAuth for authentication. It's designed with future maintainability and integration into F3 Nation's existing systems in mind.

---

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
* **Reference links** between related entries (e.g., Crawl Bear references Bear Crawl)

### ✨ Extra Features

* **Notification banner for admins** showing count of pending submissions
* **Inline editing of entries before approval** including a searchable exercise database for tagging related exicon entries
* **Support for submitting F3 Name and Region** during submission, visible to admins
* **Starring/favoriting workouts** as a way to plan future Qs

---

## Screenshots

*Coming soon*

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

## Setup & Deployment

Instructions for setting up and deploying the application are included in the `/docs/setup.md` file. This project was built to run on GCP and can be quickly deployed using GitHub Actions or the `gcloud` CLI.

---

## License & Ownership

This submission is made in accordance with the hackathon's legal terms. All code is open source and owned by F3 Nation. Significant contributors and creators will be listed in the main GitHub repository if this entry is selected.

---

## Author

**Kevin Jones**

F3 Name: *Peacock*

F3 Region: *South Fork*
