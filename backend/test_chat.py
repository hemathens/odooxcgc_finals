#!/usr/bin/env python3
"""
Test script for AI ChatBot functionality
Run this to verify the chat API works without frontend
"""

import os
import asyncio
from openai import OpenAI

async def test_openai_connection():
    """Test OpenAI API connection"""
    print("🔍 Testing OpenAI API Connection...")
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("❌ OPENAI_API_KEY not found in environment variables")
        print("💡 Set it with: $env:OPENAI_API_KEY='sk-your-key-here'")
        return False
    
    if not api_key.startswith("sk-"):
        print("❌ Invalid OpenAI API key format (should start with 'sk-')")
        return False
    
    try:
        client = OpenAI(api_key=api_key)
        
        # Test with a simple message
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say 'Hello, World!' to test the API connection."}
            ],
            max_tokens=50
        )
        
        print("✅ OpenAI API connection successful!")
        print(f"📝 Response: {response.choices[0].message.content}")
        return True
        
    except Exception as e:
        print(f"❌ OpenAI API error: {e}")
        print("💡 Check your API key and billing account")
        return False

def test_database_models():
    """Test if database models can be imported"""
    print("\n🔍 Testing Database Models...")
    
    try:
        from models import ChatConversation, ChatMessage, MessageRole
        print("✅ Chat models imported successfully!")
        return True
    except Exception as e:
        print(f"❌ Error importing chat models: {e}")
        return False

def test_chat_router():
    """Test if chat router can be imported"""
    print("\n🔍 Testing Chat Router...")
    
    try:
        from routers import chat
        print("✅ Chat router imported successfully!")
        return True
    except Exception as e:
        print(f"❌ Error importing chat router: {e}")
        return False

async def main():
    """Run all tests"""
    print("🤖 AI ChatBot Backend Test Suite")
    print("=" * 50)
    
    # Test OpenAI connection
    openai_ok = await test_openai_connection()
    
    # Test database models
    models_ok = test_database_models()
    
    # Test chat router
    router_ok = test_chat_router()
    
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"OpenAI API: {'✅ Pass' if openai_ok else '❌ Fail'}")
    print(f"Database Models: {'✅ Pass' if models_ok else '❌ Fail'}")
    print(f"Chat Router: {'✅ Pass' if router_ok else '❌ Fail'}")
    
    if all([openai_ok, models_ok, router_ok]):
        print("\n🎉 All tests passed! Your AI ChatBot backend is ready!")
        print("\n🚀 Next steps:")
        print("1. Start the backend server: python main.py")
        print("2. Login as a student in the frontend")
        print("3. Navigate to AI ChatBot and start chatting!")
    else:
        print("\n⚠️  Some tests failed. Please fix the issues above.")
        
        if not openai_ok:
            print("\n🔧 To fix OpenAI issues:")
            print("1. Get API key from https://platform.openai.com/")
            print("2. Set environment variable: $env:OPENAI_API_KEY='sk-your-key'")
            print("3. Ensure you have billing set up in OpenAI account")

if __name__ == "__main__":
    asyncio.run(main())
