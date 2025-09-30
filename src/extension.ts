import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const provider = vscode.workspace.onDidChangeTextDocument(event => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || event.document !== editor.document) {
            return;
        }

        const change = event.contentChanges[0];
		// Actúa solo cuando se inserta espacio o enter.
        if (!change || !change.text.match(/\s/)) {return;}

        const position = change.range.end;
        const line = editor.document.lineAt(position.line);
        const text = line.text.substring(0, position.character);

        const match = text.match(/(engrish(\d*)$)/);
        if (match) {
            const fullMatch = match[1];
            const numMatch = match[2];
            const wordCount = numMatch ? parseInt(numMatch, 10) : 50;
            const generatedText = generateEngrishText(wordCount);

            const startPos = position.translate(0, -fullMatch.length);
            const range = new vscode.Range(startPos, position);

            editor.edit(editBuilder => {
                editBuilder.replace(range, generatedText);
            });
        }
    });

    context.subscriptions.push(provider);
}

export function deactivate() {}

function generateEngrishText(wordCount: number): string {
    const subjects = [
        "I", "you", "we", "they", "he", "she", "it", "this", "that", "people", "everyone", "someone", "anyone", "nobody", "no one", 
        "everybody", "each", "either", "neither", "one", "everyone else", "anybody", "somebody", "who", "whom", "myself", "yourself", 
        "himself", "herself", "itself", "ourselves", "yourselves", "themselves", "someone else"

    ];

    const verbs = [
        "is", "are", "was", "were", "have", "has", "do", "does", "make", "go", "come", "try", "feel", "think", "say", "see", "like", 
        "love", "hope", "believe", "want", "need", "know", "get", "give", "take", "find", "tell", "call", "keep", "let", "show", 
        "work", "play", "run", "walk", "write", "read", "listen", "watch", "talk", "speak", "learn", "understand", "remember", "forget", 
        "move", "stand", "sit", "open", "close", "begin", "start", "stop", "help", "build", "break", "carry", "bring", "buy", "sell", 
        "pay", "drive", "ride", "cook", "eat", "drink", "sleep", "wake", "draw", "paint", "dance", "sing", "laugh", "cry", "win", "lose", 
        "change", "grow", "create", "imagine", "choose", "answer", "ask", "wait", "hate", "enjoy", "share", "stay", "travel", "follow", 
        "lead", "watch", "join", "live", "die", "borrow", "lend"

    ];

    const adjectives = [
        "happy", "sad", "beautiful", "strange", "wonderful", "exciting", "dangerous", "big", "small", "fast", "slow", "bright", "dark", 
        "funny","weird", "amazing", "smart", "strong", "weak", "kind", "mean", "cold", "hot", "friendly", "lonely", "angry", "brave", 
        "quiet", "noisy","clean", "dirty", "tall", "short", "old", "young", "hard", "soft", "sweet"
    ];

    const nouns = [
        "time", "day", "life", "world", "game", "dream", "power", "smile", "future", "chance", "joy", "danger", "face", "taste", "effort",
        "hope", "story", "love", "fear", "light", "sound", "truth", "friend", "heart", "mind", "voice", "pain", "freedom", "choice", 
        "memory", "wish", "plan", "secret", "peace", "strength", "beginning", "end", "change", "goal", "idea", "thought", "fact", 
        "question", "answer", "reason", "lesson", "experience", "problem", "solution", "message", "sign", "image", "picture", "photo", 
        "music", "movie", "book", "letter", "word", "name", "number", "line", "point", "way", "path", "road", "street", "place", "home", 
        "house", "school", "city", "country", "room", "bed", "chair", "table", "door", "window", "wall", "floor", "sky", "sun", "moon", 
        "star", "fire", "water", "air", "earth", "tree", "flower", "animal", "bird", "cat", "dog", "fish", "food", "drink", "meal", 
        "breakfast", "lunch", "dinner", "job", "work", "business", "money", "price", "cost", "value", "market", "store", "shop", "gift", 
        "box", "bag", "phone", "computer", "clock", "watch", "clothes", "shirt", "pants", "shoes", "hat", "rain", "snow", "wind", "storm", 
        "season", "summer", "winter", "spring", "autumn", "friendship", "relationship", "emotion", "feeling", "dream", "nightmare", "enemy", 
        "partner", "group", "team", "class", "student", "teacher", "child", "kid", "adult", "man", "woman", "person", "people", "body", 
        "hand", "arm", "leg", "head", "eye", "ear", "mouth", "nose", "skin", "hair", "health", "illness", "hospital", "doctor", "medicine", 
        "science", "technology", "internet", "email", "news", "event", "party", "celebration", "festival", "holiday", "trip", "journey", 
        "travel", "adventure", "accident", "crime", "law", "rule", "right", "duty", "war", "battle", "victory", "defeat", "truth", "lie", 
        "silence", "noise", "habit", "activity", "sport", "exercise", "movement", "speed", "distance", "height", "weight", "size", "color", 
        "shape", "material", "object", "tool", "machine", "device", "toy", "game", "puzzle", "test", "exam", "grade", "result", "success", 
        "failure", "career", "position", "title", "role", "leader", "follower", "artist", "writer", "musician", "actor", "player", "driver", 
        "singer", "dancer", "creator", "builder", "inventor", "owner", "customer", "client", "user", "viewer", "listener", "audience", "crowd", 
        "community", "society", "culture", "tradition", "history", "future", "past", "present"
    ];

    const adverbs = [
        "very", "really", "much", "so", "too", "quite", "almost", "never", "always", "sometimes", "often", "rarely", "usually", "hardly", 
        "already", "just", "still", "yet", "soon", "late", "early", "fast", "well", "here", "there", "everywhere", "abroad", "away", "back", 
        "upstairs", "downstairs", "now", "then", "today", "tomorrow", "yesterday"
    ];

    const connectors = [
        "and", "but", "or", "because", "so", "although", "however", "then", "also", "moreover", "in addition", "furthermore", "besides", 
        "nevertheless", "on the other hand", "even though", "despite", "whereas", "in contrast", "therefore", "thus", "as a result", 
        "consequently", "due to", "afterwards", "meanwhile", "subsequently", "at first", "eventually", "later", "finally", "for example", 
        "for instance", "that is", "namely"

    ];

    const prepositions = [
        "to", "with", "for", "on", "at", "by", "about", "against", "between", "into", "above", "under", "over", "through", "behind", 
        "inside", "since", "until", "without", "within", "across", "along", "beneath", "beside", "beyond", "despite", "during", "except", 
        "from", "in", "near", "off", "out", "outside", "past", "per", "regarding", "round", "towards", "upon"
    ];

    let sentences: string[] = [];
    let wordsUsed = 0;

    function generateClause(): string {
        const subject = subjects[randomIndex(subjects)];
        const verb = verbs[randomIndex(verbs)];
        let clause = subject;

        if (["is", "are", "was", "were","have","has","do"].includes(verb)) {
            if (Math.random() < 0.6) {
                clause += ` ${verb} ${adverbs[randomIndex(adverbs)]} ${adjectives[randomIndex(adjectives)]}`;
            } else {
                clause += ` ${verb} ${nouns[randomIndex(nouns)]}`;
            }
        } else {
            clause += ` ${verb}`;

            if (Math.random() < 0.7) {
                clause += ` ${prepositions[randomIndex(prepositions)]} ${nouns[randomIndex(nouns)]}`;
            }
        }
        return clause;
    }

    while (wordsUsed < wordCount) {
        const wordsLeft = wordCount - wordsUsed;

        if (wordCount <= 2) {
            let phrase = generateClause();
            const phraseWords = phrase.split(" ");
            if (phraseWords.length > wordsLeft) {
                phrase = phraseWords.slice(0, wordsLeft).join(" ");
            }
            phrase = phrase.charAt(0).toUpperCase() + phrase.slice(1) + ".";
            sentences.push(phrase);
            wordsUsed += phrase.split(" ").length;
            continue;
        }

        // Para > 2 palabras pedidas, cada frase debe tener mínimo 3 palabras

        let clauseCount = 1 + Math.floor(Math.random() * 3);
        if (clauseCount < 1) {clauseCount = 1;}

        // Ajustar clauseCount para no generar frases muy cortas:
        if (clauseCount === 1 && wordsLeft >= 3) {clauseCount = 2;}

        let phraseParts: string[] = [];

        for (let i = 0; i < clauseCount; i++) {
            phraseParts.push(generateClause());
        }

        let phrase = phraseParts.join(` ${connectors[randomIndex(connectors)]} `);

        phrase = phrase.charAt(0).toUpperCase() + phrase.slice(1) + ".";

        const phraseWordsCount = phrase.split(" ").length;

        if (phraseWordsCount > wordsLeft) {
            const wordsArray = phrase.split(" ").slice(0, wordsLeft);
            phrase = wordsArray.join(" ");
            if (!/[.!?]$/.test(phrase)) {phrase += ".";}
        }
        sentences.push(phrase);
        wordsUsed += phrase.split(" ").length;
    }

    let text = sentences.join(" ");

    let splitWords = text.split(" ");
    if (splitWords.length > wordCount) {
        splitWords = splitWords.slice(0, wordCount);
        text = splitWords.join(" ");
        if (!/[.!?]$/.test(text)) {text += ".";}
    }

    return text;
}

function randomIndex(arr: any[]) {
    return Math.floor(Math.random() * arr.length);
}