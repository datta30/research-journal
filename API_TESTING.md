# API Testing Guide - Research Journal Management System

## Quick Test Sequence

### 1. Register Users

#### Register Author
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "author@test.com",
    "password": "password123",
    "firstName": "Alice",
    "lastName": "Author",
    "affiliation": "MIT",
    "roles": ["AUTHOR"]
  }'
```

#### Register Editor
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "editor@test.com",
    "password": "password123",
    "firstName": "Bob",
    "lastName": "Editor",
    "affiliation": "Stanford",
    "roles": ["EDITOR"]
  }'
```

#### Register Reviewer
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "reviewer@test.com",
    "password": "password123",
    "firstName": "Carol",
    "lastName": "Reviewer",
    "affiliation": "Harvard",
    "roles": ["REVIEWER"]
  }'
```

### 2. Login and Get Tokens

#### Login as Author
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "author@test.com",
    "password": "password123"
  }'
```
Response: Save the `token` value as `AUTHOR_TOKEN`

#### Login as Editor
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "editor@test.com",
    "password": "password123"
  }'
```
Response: Save the `token` value as `EDITOR_TOKEN`

#### Login as Reviewer
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "reviewer@test.com",
    "password": "password123"
  }'
```
Response: Save the `token` value as `REVIEWER_TOKEN`

### 3. Author Actions

#### Submit Paper (Replace AUTHOR_TOKEN)
```bash
curl -X POST http://localhost:8080/api/author/papers/submit \
  -H "Authorization: Bearer AUTHOR_TOKEN" \
  -F "title=Machine Learning in Healthcare" \
  -F "abstractText=This paper explores the application of machine learning algorithms in healthcare diagnostics..." \
  -F "keywords=machine learning, healthcare, AI, diagnostics" \
  -F "file=@/path/to/your/paper.pdf"
```
Response: Save the `id` value as `PAPER_ID`

#### Get My Papers
```bash
curl -X GET http://localhost:8080/api/author/papers \
  -H "Authorization: Bearer AUTHOR_TOKEN"
```

#### Get Paper Plagiarism Check (Replace PAPER_ID)
```bash
curl -X GET http://localhost:8080/api/author/papers/PAPER_ID/plagiarism \
  -H "Authorization: Bearer AUTHOR_TOKEN"
```

### 4. Editor Actions

#### Get Unassigned Papers
```bash
curl -X GET http://localhost:8080/api/editor/papers/unassigned \
  -H "Authorization: Bearer EDITOR_TOKEN"
```

#### Assign Paper to Self (Replace PAPER_ID)
```bash
curl -X PUT http://localhost:8080/api/editor/papers/PAPER_ID/assign \
  -H "Authorization: Bearer EDITOR_TOKEN"
```

#### Get Available Reviewers
```bash
curl -X GET http://localhost:8080/api/editor/reviewers \
  -H "Authorization: Bearer EDITOR_TOKEN"
```
Response: Save a reviewer's `id` as `REVIEWER_ID`

#### Assign Reviewer to Paper (Replace PAPER_ID and REVIEWER_ID)
```bash
curl -X POST http://localhost:8080/api/editor/papers/PAPER_ID/assign-reviewer \
  -H "Authorization: Bearer EDITOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reviewerId": REVIEWER_ID
  }'
```
Response: Save the review `id` as `REVIEW_ID`

#### Get Paper Reviews (Replace PAPER_ID)
```bash
curl -X GET http://localhost:8080/api/editor/papers/PAPER_ID/reviews \
  -H "Authorization: Bearer EDITOR_TOKEN"
```

#### Make Final Decision (Replace PAPER_ID)
```bash
curl -X PUT http://localhost:8080/api/editor/papers/PAPER_ID/decision \
  -H "Authorization: Bearer EDITOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "decision": "ACCEPTED",
    "comments": "Excellent research work. Accepted for publication."
  }'
```

### 5. Reviewer Actions

#### Get Pending Reviews
```bash
curl -X GET http://localhost:8080/api/reviewer/reviews/pending \
  -H "Authorization: Bearer REVIEWER_TOKEN"
```

#### Update Review Status to IN_PROGRESS (Replace REVIEW_ID)
```bash
curl -X PUT "http://localhost:8080/api/reviewer/reviews/REVIEW_ID/status?status=IN_PROGRESS" \
  -H "Authorization: Bearer REVIEWER_TOKEN"
```

#### Submit Review (Replace REVIEW_ID)
```bash
curl -X PUT http://localhost:8080/api/reviewer/reviews/REVIEW_ID/submit \
  -H "Authorization: Bearer REVIEWER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recommendation": "ACCEPT",
    "comments": "This paper presents novel research with significant contributions to the field. The methodology is sound and results are well-presented.",
    "qualityScore": 9,
    "originalityScore": 8,
    "clarityScore": 9,
    "significanceScore": 8
  }'
```

### 6. Public Access

#### Get Published Papers
```bash
curl -X GET http://localhost:8080/api/papers/published
```

#### Get Paper Details (Replace PAPER_ID)
```bash
curl -X GET http://localhost:8080/api/papers/PAPER_ID
```

---

## Complete Workflow Test

### Script Version (Bash)

```bash
#!/bin/bash

BASE_URL="http://localhost:8080"

echo "=== 1. Register Users ==="

# Register Author
AUTHOR_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"author@test.com","password":"password123","firstName":"Alice","lastName":"Author","roles":["AUTHOR"]}')
echo "Author registered"

# Register Editor
curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"editor@test.com","password":"password123","firstName":"Bob","lastName":"Editor","roles":["EDITOR"]}' > /dev/null
echo "Editor registered"

# Register Reviewer
curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"reviewer@test.com","password":"password123","firstName":"Carol","lastName":"Reviewer","roles":["REVIEWER"]}' > /dev/null
echo "Reviewer registered"

echo ""
echo "=== 2. Login Users ==="

# Login Author
AUTHOR_LOGIN=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"author@test.com","password":"password123"}')
AUTHOR_TOKEN=$(echo $AUTHOR_LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Author logged in: ${AUTHOR_TOKEN:0:20}..."

# Login Editor
EDITOR_LOGIN=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"editor@test.com","password":"password123"}')
EDITOR_TOKEN=$(echo $EDITOR_LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Editor logged in: ${EDITOR_TOKEN:0:20}..."

# Login Reviewer
REVIEWER_LOGIN=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"reviewer@test.com","password":"password123"}')
REVIEWER_TOKEN=$(echo $REVIEWER_LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Reviewer logged in: ${REVIEWER_TOKEN:0:20}..."

echo ""
echo "=== 3. Author Submits Paper ==="

# Note: Replace with actual PDF file path
# PAPER_RESPONSE=$(curl -s -X POST $BASE_URL/api/author/papers/submit \
#   -H "Authorization: Bearer $AUTHOR_TOKEN" \
#   -F "title=Test Paper" \
#   -F "abstractText=Test abstract" \
#   -F "keywords=test" \
#   -F "file=@paper.pdf")

echo "Paper submitted (uncomment and add PDF file)"

echo ""
echo "=== Test Complete ==="
echo "Use these tokens for further testing:"
echo "Author Token: $AUTHOR_TOKEN"
echo "Editor Token: $EDITOR_TOKEN"
echo "Reviewer Token: $REVIEWER_TOKEN"
```

---

## Environment Variables (Optional)

Create a `.env` file for easier testing:

```bash
BASE_URL=http://localhost:8080
AUTHOR_TOKEN=your_author_token_here
EDITOR_TOKEN=your_editor_token_here
REVIEWER_TOKEN=your_reviewer_token_here
PAPER_ID=1
REVIEW_ID=1
```

---

## Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "Research Journal Management System",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\",\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\",\n  \"roles\": [\"AUTHOR\"]\n}"
            },
            "url": {"raw": "http://localhost:8080/api/auth/register"}
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {"raw": "http://localhost:8080/api/auth/login"}
          }
        }
      ]
    }
  ]
}
```

---

## Testing Checklist

- [ ] Register users (Author, Editor, Reviewer)
- [ ] Login all users and save tokens
- [ ] Author submits paper
- [ ] Check plagiarism detection results
- [ ] Editor views unassigned papers
- [ ] Editor assigns paper to self
- [ ] Editor assigns reviewer
- [ ] Reviewer views assigned papers
- [ ] Reviewer submits review
- [ ] Editor views reviews
- [ ] Editor makes final decision
- [ ] Verify paper status changes
- [ ] Check published papers (public)

---

## Common Response Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

**Note**: Replace placeholder values (AUTHOR_TOKEN, PAPER_ID, etc.) with actual values from API responses.
