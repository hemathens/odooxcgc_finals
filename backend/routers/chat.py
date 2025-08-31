from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from openai import OpenAI
import os
from datetime import datetime

from database import get_db
from models import User, ChatConversation, ChatMessage, MessageRole
from schemas import ChatMessageRequest, ChatMessageResponse, ChatConversationResponse
from auth_utils import get_current_user

router = APIRouter(prefix="/chat", tags=["chat"])

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """You are an AI assistant specialized in helping students with placement and career guidance. You provide helpful, accurate, and encouraging advice on:

- Resume writing and optimization
- Interview preparation (technical, HR, behavioral)
- Job search strategies and application tips
- Career planning and skill development
- Company research and industry insights
- Application tracking and organization
- Networking and professional development

Keep your responses:
- Practical and actionable
- Encouraging and supportive
- Specific to placement/career contexts
- Professional yet friendly
- Concise but comprehensive

If asked about topics outside placement/career guidance, politely redirect the conversation back to career-related topics."""

async def generate_ai_response(user_message: str, conversation_history: List[ChatMessage] = None) -> str:
    """Generate AI response using OpenAI API"""
    try:
        # Prepare conversation history for context
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        
        # Add recent conversation history (last 10 messages for context)
        if conversation_history:
            recent_messages = conversation_history[-10:]
            for msg in recent_messages:
                messages.append({
                    "role": msg.role.value,
                    "content": msg.content
                })
        
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"OpenAI API error: {e}")
        return "I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment. In the meantime, feel free to explore the other features of the placement tracker!"

@router.post("/send-message", response_model=ChatMessageResponse)
async def send_message(
    message_request: ChatMessageRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message and get AI response"""
    
    # Only students can use the chatbot for now
    if current_user.role.value != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chat functionality is currently only available for students"
        )
    
    # Get or create conversation
    conversation = None
    if message_request.conversation_id:
        conversation = db.query(ChatConversation).filter(
            ChatConversation.id == message_request.conversation_id,
            ChatConversation.user_id == current_user.id
        ).first()
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )
    else:
        # Create new conversation
        conversation = ChatConversation(
            user_id=current_user.id,
            title=message_request.content[:50] + "..." if len(message_request.content) > 50 else message_request.content
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    
    # Save user message
    user_message = ChatMessage(
        conversation_id=conversation.id,
        role=MessageRole.USER,
        content=message_request.content
    )
    db.add(user_message)
    db.commit()
    db.refresh(user_message)
    
    # Get conversation history for context
    conversation_history = db.query(ChatMessage).filter(
        ChatMessage.conversation_id == conversation.id
    ).order_by(ChatMessage.created_at).all()
    
    # Generate AI response
    ai_response_content = await generate_ai_response(
        message_request.content, 
        conversation_history[:-1]  # Exclude the current message
    )
    
    # Save AI response
    ai_message = ChatMessage(
        conversation_id=conversation.id,
        role=MessageRole.ASSISTANT,
        content=ai_response_content
    )
    db.add(ai_message)
    db.commit()
    db.refresh(ai_message)
    
    return ai_message

@router.get("/conversations", response_model=List[ChatConversationResponse])
async def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all conversations for the current user"""
    
    if current_user.role.value != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chat functionality is currently only available for students"
        )
    
    conversations = db.query(ChatConversation).filter(
        ChatConversation.user_id == current_user.id,
        ChatConversation.is_active == True
    ).order_by(ChatConversation.updated_at.desc()).all()
    
    return conversations

@router.get("/conversations/{conversation_id}", response_model=ChatConversationResponse)
async def get_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific conversation with all messages"""
    
    if current_user.role.value != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chat functionality is currently only available for students"
        )
    
    conversation = db.query(ChatConversation).filter(
        ChatConversation.id == conversation_id,
        ChatConversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    return conversation

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a conversation"""
    
    if current_user.role.value != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chat functionality is currently only available for students"
        )
    
    conversation = db.query(ChatConversation).filter(
        ChatConversation.id == conversation_id,
        ChatConversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    # Soft delete by setting is_active to False
    conversation.is_active = False
    db.commit()
    
    return {"message": "Conversation deleted successfully"}
