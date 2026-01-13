"""
AI-powered insights service using OpenAI GPT-4
"""
from typing import Optional
from openai import AsyncOpenAI
from ..core.config import settings


class AIService:
    def __init__(self):
        self.client = None
        if settings.OPENAI_API_KEY:
            self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    async def generate_self_inquiry_questions(self, count: int = 5) -> list[str]:
        """Generate random self-inquiry questions to break autopilot"""
        if not self.client:
            return self._default_questions()[:count]

        try:
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a mindfulness coach. Generate thought-provoking self-inquiry questions that help people break out of autopilot mode and examine their current state, actions, and alignment with their goals."
                    },
                    {
                        "role": "user",
                        "content": f"Generate {count} unique, powerful self-inquiry questions. Return only the questions, one per line."
                    }
                ],
                max_tokens=500,
                temperature=0.9
            )

            questions = response.choices[0].message.content.strip().split("\n")
            return [q.strip().lstrip("0123456789.-) ") for q in questions if q.strip()]

        except Exception:
            return self._default_questions()[:count]

    async def analyze_vision_alignment(
        self,
        vision: str,
        anti_vision: str,
        current_actions: str
    ) -> str:
        """Analyze how current actions align with vision and anti-vision"""
        if not self.client:
            return "AI insights unavailable. Configure OPENAI_API_KEY to enable."

        try:
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a life coach specializing in goal alignment. Analyze whether someone's actions are moving them toward their vision or toward their anti-vision (what they fear/hate)."
                    },
                    {
                        "role": "user",
                        "content": f"""
Vision (what they want): {vision}
Anti-Vision (what they fear/hate): {anti_vision}
Current actions: {current_actions}

Provide a brief but powerful analysis of their alignment and specific actionable advice.
"""
                    }
                ],
                max_tokens=400,
                temperature=0.7
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            return f"Unable to generate insights: {str(e)}"

    async def suggest_daily_levers(
        self,
        goal: str,
        project: Optional[str] = None
    ) -> list[str]:
        """Suggest daily actions (levers) to achieve a goal/project"""
        if not self.client:
            return ["Break down your goal into smaller tasks", "Take one small action today"]

        try:
            project_context = f" within the context of project: {project}" if project else ""
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a productivity expert. Suggest specific, actionable daily tasks that compound toward larger goals."
                    },
                    {
                        "role": "user",
                        "content": f"Suggest 5 daily actions (levers) to achieve this goal{project_context}: {goal}"
                    }
                ],
                max_tokens=300,
                temperature=0.8
            )

            suggestions = response.choices[0].message.content.strip().split("\n")
            return [s.strip().lstrip("0123456789.-) ") for s in suggestions if s.strip()][:5]

        except Exception:
            return ["Break down your goal into smaller tasks", "Take one small action today"]

    async def generate_reflection_insights(
        self,
        wins: str,
        challenges: str,
        phase: str
    ) -> str:
        """Generate insights from daily reflection"""
        if not self.client:
            return "Keep tracking your progress. Insights will be available when OpenAI API is configured."

        try:
            response = await self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": f"You are a growth mindset coach. The user is in the {phase} phase of change. Provide encouraging but honest insights."
                    },
                    {
                        "role": "user",
                        "content": f"""
Today's wins: {wins}
Today's challenges: {challenges}

Provide brief but impactful insights and encouragement.
"""
                    }
                ],
                max_tokens=250,
                temperature=0.7
            )

            return response.choices[0].message.content.strip()

        except Exception:
            return "Keep going! Every challenge is a learning opportunity."

    def _default_questions(self) -> list[str]:
        """Default self-inquiry questions when AI is unavailable"""
        return [
            "What am I avoiding right now?",
            "Is this action moving me toward my vision or away from it?",
            "What would my future self want me to do in this moment?",
            "Am I operating from fear or from purpose?",
            "What's the smallest action I can take right now toward my goal?",
            "Who am I becoming with my current choices?",
            "What story am I telling myself about this situation?",
            "If I continue on this path, where will I be in one year?",
            "What would I do if I weren't afraid?",
            "Am I living by design or by default?",
            "What does my calendar say about my priorities?",
            "Is my identity helping or hurting my progress?",
            "What boundaries do I need to set today?",
            "Am I solving the right problem?",
            "What would love/courage do in this situation?",
        ]


# Singleton instance
ai_service = AIService()
