// app/api/pi/auth/route.ts
import { NextRequest, NextResponse } from "next/server"

// Mode sandbox (test) ou production
const PI_SANDBOX = process.env.NEXT_PUBLIC_PI_NETWORK_SANDBOX === 'true'
const PI_API_KEY = process.env.PI_API_KEY

// Stockage temporaire des sessions (à remplacer par une base de données)
const sessions = new Map<string, { uid: string; username: string; createdAt: string }>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, accessToken, userId } = body

    console.log("🔐 Pi Auth API - Requête reçue:", { action, mode: PI_SANDBOX ? "SANDBOX" : "PRODUCTION" })

    // === MODE SANDBOX ===
    if (PI_SANDBOX || !PI_API_KEY) {
      console.log("🏖️ [SANDBOX MODE] Authentification simulée")

      if (action === "authenticate") {
        const demoUser = {
          uid: "demo_" + Date.now(),
          username: "demo_user_" + Math.random().toString(36).slice(2, 8),
          accessToken: "demo_token_" + Date.now()
        }

        // Stocker la session
        sessions.set(demoUser.uid, {
          uid: demoUser.uid,
          username: demoUser.username,
          createdAt: new Date().toISOString()
        })

        return NextResponse.json({
          success: true,
          user: demoUser,
          message: "Mode sandbox - Authentification simulée"
        })
      }

      if (action === "verify") {
        const session = sessions.get(userId)
        if (session) {
          return NextResponse.json({
            success: true,
            verified: true,
            user: session
          })
        }
        return NextResponse.json({
          success: false,
          verified: false,
          message: "Session non trouvée"
        })
      }

      if (action === "logout") {
        sessions.delete(userId)
        return NextResponse.json({
          success: true,
          message: "Déconnexion réussie"
        })
      }

      return NextResponse.json({
        success: false,
        error: "Action invalide"
      }, { status: 400 })
    }

    // === MODE PRODUCTION ===
    if (action === "authenticate") {
      // Vérifier le token avec l'API Pi
      const response = await fetch("https://api.minepi.com/v2/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error(`Authentification échouée: ${response.status}`)
      }

      const userData = await response.json()
      
      // Stocker la session
      sessions.set(userData.uid, {
        uid: userData.uid,
        username: userData.username,
        createdAt: new Date().toISOString()
      })

      console.log(`✅ Utilisateur authentifié: ${userData.username} (${userData.uid})`)

      return NextResponse.json({
        success: true,
        user: {
          uid: userData.uid,
          username: userData.username,
          accessToken: accessToken
        }
      })
    }

    if (action === "verify") {
      const session = sessions.get(userId)
      if (session) {
        return NextResponse.json({
          success: true,
          verified: true,
          user: session
        })
      }
      return NextResponse.json({
        success: false,
        verified: false
      })
    }

    if (action === "logout") {
      sessions.delete(userId)
      return NextResponse.json({
        success: true,
        message: "Déconnexion réussie"
      })
    }

    return NextResponse.json({
      success: false,
      error: "Action invalide"
    }, { status: 400 })

  } catch (error: any) {
    console.error("❌ Erreur auth Pi:", error.message)
    return NextResponse.json({
      success: false,
      error: error.message || "Erreur serveur"
    }, { status: 500 })
  }
}

// GET - Vérifier l'état de l'authentification
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId")
  
  if (!userId) {
    return NextResponse.json({ error: "userId requis" }, { status: 400 })
  }

  const session = sessions.get(userId)
  
  return NextResponse.json({
    authenticated: !!session,
    user: session || null
  })
}