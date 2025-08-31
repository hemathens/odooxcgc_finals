# AI ChatBot Setup Guide

## Overview
The AI ChatBot feature has been implemented with a complete frontend interface and backend API integration. Here's how to get it working:

## 🔧 Backend Setup

### 1. Install Dependencies
First, install the new OpenAI dependency:

```bash
cd backend
pip install -r requirements.txt
```

### 2. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-...`)

### 3. Environment Configuration
Add your OpenAI API key to your environment variables:

**Option A: Environment File**
Create/update `.env` file in the backend directory:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Option B: Direct Environment Variable**
```bash
# Windows (PowerShell)
$env:OPENAI_API_KEY="sk-your-actual-api-key-here"

# Windows (Command Prompt)
set OPENAI_API_KEY=sk-your-actual-api-key-here

# Linux/Mac
export OPENAI_API_KEY="sk-your-actual-api-key-here"
```

### 4. Database Setup
The database tables have been created. If you need to recreate them:
```bash
cd backend
python init_db.py
```

### 5. Start Backend Server
```bash
cd backend
python main.py
```

The server should start on `http://localhost:8000`

## 🎨 Frontend Setup

The frontend is already implemented and configured. No additional setup needed.

## 🚀 How to Use

### For Students:
1. Login as a student
2. Navigate to "AI ChatBot" in the navigation menu
3. Start chatting with the AI assistant
4. Ask questions about:
   - Resume writing
   - Interview preparation
   - Job search strategies
   - Career guidance
   - Application tracking

### Features Available:
- **Real-time AI responses** powered by OpenAI GPT-3.5
- **Conversation persistence** - chats are saved and restored
- **Context awareness** - AI remembers conversation history
- **Specialized prompts** - AI is trained specifically for placement guidance
- **Error handling** - Graceful handling of API failures
- **Responsive design** - Works on all devices

## 🔍 API Endpoints

The following chat endpoints are available:

- `POST /api/chat/send-message` - Send a message and get AI response
- `GET /api/chat/conversations` - Get all user conversations
- `GET /api/chat/conversations/{id}` - Get specific conversation
- `DELETE /api/chat/conversations/{id}` - Delete a conversation

## 🗄️ Database Schema

### New Tables Added:
- `chat_conversations` - Stores conversation metadata
- `chat_messages` - Stores individual messages

### Models:
- `ChatConversation` - User conversations
- `ChatMessage` - Individual messages with role (user/assistant/system)
- `MessageRole` - Enum for message types

## 🔐 Security Features

- **Role-based access** - Only students can access chat
- **User isolation** - Users can only see their own conversations
- **Soft delete** - Conversations are marked inactive, not permanently deleted
- **Authentication required** - All endpoints require valid JWT token

## 🎯 Testing the Integration

1. **Start the backend server**
2. **Login as a student** in the frontend
3. **Navigate to AI ChatBot**
4. **Send a test message** like "How can I improve my resume?"
5. **Wait for AI response** (should take 2-3 seconds)

## 🚨 Troubleshooting

### Common Issues:

1. **"OpenAI API error"**
   - Check if OPENAI_API_KEY is set correctly
   - Verify you have API credits in your OpenAI account
   - Check internet connection

2. **"Failed to send message"**
   - Ensure backend server is running
   - Check CORS configuration
   - Verify user is logged in as student

3. **Database errors**
   - Run `python init_db.py` to recreate tables
   - Check database connection

### API Key Issues:
- Make sure the API key starts with `sk-`
- Ensure you have billing set up in OpenAI
- Check rate limits and usage quotas

## 💰 Cost Considerations

- OpenAI charges per token used
- GPT-3.5-turbo is cost-effective for this use case
- Monitor usage in OpenAI dashboard
- Consider implementing rate limiting for production

## 🔄 Next Steps

### Immediate Improvements:
1. Add rate limiting per user
2. Implement conversation titles auto-generation
3. Add message search functionality
4. Create admin panel for monitoring chat usage

### Advanced Features:
1. Add file upload for resume analysis
2. Implement conversation sharing
3. Add conversation export functionality
4. Create chat analytics dashboard

## 📝 Development Notes

- The AI assistant is specifically prompted for placement/career guidance
- Conversation history provides context for better responses
- All chats are persisted in the database
- Frontend gracefully handles API failures
- Ready for production deployment with proper environment setup
