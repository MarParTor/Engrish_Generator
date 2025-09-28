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
        "I", "You", "We", "They", "He", "She", "It", "This", "That", "People", "Everyone"
    ];

    const verbs = [
        "is", "are", "was", "were", "have", "has", "do", "does", "make", "go", "come", "try",
        "feel", "think", "say", "see", "like", "love", "hope", "believe", "want", "need"
    ];

    const adjectives = [
        "happy", "sad", "beautiful", "strange", "wonderful", "exciting", "dangerous",
        "big", "small", "fast", "slow", "bright", "dark", "funny", "weird", "amazing"
    ];

    const nouns = [
        "time", "day", "life", "world", "game", "dream", "power", "smile", "future",
        "chance", "joy", "danger", "face", "taste", "effort", "hope", "story"
    ];

    const adverbs = [
        "very", "really", "much", "so", "too", "quite", "almost", "never", "always", "sometimes"
    ];

    const connectors = [
        "and", "but", "or", "because", "so", "although", "however", "then"
    ];

    const prepositions = [
        "to", "with", "for", "on", "at", "by", "about", "against", "between", "into"
    ];

    let sentences: string[] = [];
    let wordsUsed = 0;

    function generateClause(): string {
        const subject = subjects[randomIndex(subjects)];
        const verb = verbs[randomIndex(verbs)];
        let clause = subject;

        if (["is", "are", "was", "were"].includes(verb)) {
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