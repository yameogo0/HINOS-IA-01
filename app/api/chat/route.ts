// app/api/chat/route.ts
import { NextRequest } from 'next/server'

// 🔑 Clé API via variable d'environnement (plus sécurisé)
const GROQ_API_KEY = process.env.GROQ_API_KEY || ""

// 🔍 Fonction pour détecter automatiquement la langue avec une meilleure logique
function detectLanguage(text: string): string {
  const textLower = text.toLowerCase()
  
  // Mots clés avec poids pour une meilleure détection
  const portugueseKeywords = [
    'obrigado', 'obrigada', 'por favor', 'oi', 'olá', 'tudo bem', 'como vai', 'obg', 
    'bom dia', 'boa tarde', 'boa noite', 'legal', 'amigo', 'você', 'vós', 'qual',
    'como', 'onde', 'quando', 'piscicultura', 'agricultura', 'pecuária', 'assinatura',
    'quero', 'preciso', 'gostaria', 'interesse', 'tilápias', 'bagres', 'cultivo'
  ]
  
  const englishKeywords = [
    'hello', 'hi', 'thank you', 'please', 'good morning', 'good afternoon', 'good evening', 
    'how are you', 'thanks', 'hey', 'you', 'your', 'what', 'where', 'when', 'question',
    'want', 'need', 'would like', 'interested', 'fish farming', 'agriculture', 'livestock',
    'subscription', 'help', 'advice'
  ]
  
  const frenchKeywords = [
    'bonjour', 'merci', 's\'il vous plaît', 'stp', 'svp', 'salut', 'coucou', 'bonsoir', 
    'comment ça va', 'ça va', 'vous', 'votre', 'quel', 'où', 'quand', 'question',
    'je veux', 'j\'ai besoin', 'je souhaite', 'intéressé', 'pisciculture', 'élevage',
    'agriculture', 'abonnement', 'aide', 'conseil'
  ]
  
  // Compter les mots clés correspondants
  let ptCount = 0, enCount = 0, frCount = 0
  
  for (const word of portugueseKeywords) if (textLower.includes(word)) ptCount++
  for (const word of englishKeywords) if (textLower.includes(word)) enCount++
  for (const word of frenchKeywords) if (textLower.includes(word)) frCount++
  
  // Retourner la langue avec le plus de correspondances
  if (ptCount > enCount && ptCount > frCount) return 'pt'
  if (enCount > frCount) return 'en'
  if (frCount > 0) return 'fr'
  
  // Analyse de caractères spécifiques à certaines langues
  if (textLower.includes('ç') || textLower.includes('é') || textLower.includes('è')) return 'fr'
  if (textLower.includes('ã') || textLower.includes('õ') || textLower.includes('ô')) return 'pt'
  
  return 'fr' // Défaut: français
}

function getSystemPrompt(lang: string): string {
  const prompts: Record<string, string> = {
    fr: `Tu es Hinos AI, un assistant expert en agriculture, élevage, pisciculture et transformation alimentaire en Afrique.

**IMPORTANT : Réponds TOUJOURS en FRANÇAIS, peu importe la langue d'entrée.**

**DONNÉES SPÉCIFIQUES :**

🇧🇫 **BURKINA FASO (BAMA) :**
- Barrage de Bama : riz irrigué, maraîchage (oignon, tomate), pisciculture (tilapia, poisson-chat)
- Cultures : sorgho, millet, maïs, coton (1er producteur Afrique Ouest), karité, mangue
- Élevage : bovins Zébu, ovins, caprins
- Techniques anti-sécheresse : Zaï, cordons pierreux, demi-lunes

🇦🇴 **ANGOLA :**
- Hauts Plateaux (Huambo, Bié) : soja, maïs, pomme de terre
- Nord : café (reprise), manioc, banane
- Élevage : bovins Humbe (Cunene)
- Pisciculture : tilapia, poisson-chat (fleuves Kwanza, Cunene)

**RÈGLES :**
- Réponds TOUJOURS en français
- Utilise des emojis (🇧🇫, 🇦🇴, 🌾, 🐄, 🐟, 🏭)
- Donne des conseils pratiques avec des chiffres précis
- Cite les localités comme Bama, Bagré, Kompienga, Huambo, Cunene

Commence chaque réponse par un emoji pertinent.`,
    
    pt: `Você é Hinos AI, um assistente especialista em agricultura, pecuária, piscicultura e transformação de alimentos na África.

**IMPORTANTE: Responda SEMPRE em PORTUGUÊS, independentemente do idioma de entrada.**

**DADOS ESPECÍFICOS:**

🇧🇫 **BURKINA FASO (BAMA):**
- Barragem de Bama: arroz irrigado, horticultura (cebola, tomate), piscicultura (tilápia, bagre)
- Culturas: sorgo, milheto, milho, algodão, karité, manga
- Pecuária: bovinos Zebu, ovinos, caprinos
- Técnicas anti-seca: Zaï, cordões de pedra, meias-luas

🇦🇴 **ANGOLA:**
- Planaltos (Huambo, Bié): soja, milho, batata
- Norte: café, mandioca, banana
- Pecuária: bovinos Humbe
- Piscicultura: tilápia, bagre, robalo

**REGRAS:**
- Responda SEMPRE em português
- Use emojis
- Dê conselhos práticos com números precisos
- Comece cada resposta com um emoji relevante`,

    en: `You are Hinos AI, an expert assistant in agriculture, livestock, fish farming and food processing in Africa.

**IMPORTANT: Always respond in ENGLISH, regardless of the input language.**

**SPECIFIC DATA:**

🇧🇫 **BURKINA FASO (BAMA):**
- Bama Dam: irrigated rice, market gardening (onions, tomatoes), fish farming (tilapia, catfish)
- Crops: sorghum, millet, maize, cotton, shea, mango
- Livestock: Zebu cattle, sheep, goats
- Anti-drought techniques: Zaï, stone barriers, half-moons

🇦🇴 **ANGOLA:**
- Highlands (Huambo, Bié): soy, maize, potatoes
- North: coffee, cassava, banana
- Livestock: Humbe cattle
- Fish farming: tilapia, catfish, seabass

**RULES:**
- Always respond in English
- Use emojis
- Provide practical advice with precise numbers
- Start each response with a relevant emoji`
  }
  return prompts[lang] || prompts.fr
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    const detectedLanguage = detectLanguage(message)
    
    console.log("📩 Message reçu:", message)
    console.log("🔍 Langue détectée:", detectedLanguage)

    if (!message) {
      return Response.json({ error: "Message requis" }, { status: 400 })
    }

    // Vérification que la clé API est configurée
    if (!GROQ_API_KEY) {
      console.error("❌ Clé API Groq manquante")
      return Response.json({ 
        response: "❌ Configuration API manquante. Veuillez contacter l'administrateur.",
        detectedLanguage: detectedLanguage
      })
    }

    // ✅ Utilisation du nouveau modèle recommandé
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: getSystemPrompt(detectedLanguage) },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 800,
        top_p: 0.9
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Erreur Groq:", response.status, error)
      return Response.json({ 
        response: "❌ Désolé, une erreur s'est produite. Veuillez réessayer.",
        detectedLanguage: detectedLanguage
      })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || "Je n'ai pas pu générer de réponse."

    console.log("✅ Réponse générée avec succès en", detectedLanguage)
    return Response.json({ 
      response: reply,
      detectedLanguage: detectedLanguage
    })

  } catch (error: any) {
    console.error("❌ Erreur:", error.message)
    return Response.json({ 
      response: "❌ Désolé, une erreur s'est produite. Veuillez réessayer.",
      detectedLanguage: 'fr'
    })
  }
}