import * as vscode from 'vscode';
import runCompletion from './runCompletion';
import getCurrentPosition from './textPosition';
import {
    setSuggestionsState,
    getCurrentSuggestion,
} from './suggestionSelector'
import { AutocompleteResult } from "./requests/requests";
import { setInlineSuggestion, clearInlineSuggestionsState } from "./setSuggestions";
export default async function textListener({
    document,
    contentChanges,
}: vscode.TextDocumentChangeEvent): Promise<void> {
    const [change] = contentChanges;
    if (!change) {
        return;
    }
    const currentTextPosition = getCurrentPosition(change);
    // if (!completionIsAllowed(document, currentTextPosition)) {
    //   return;
    // }
    const autocompleteResult = await runCompletion(
        document,
        currentTextPosition
    );

    await setCompletion(autocompleteResult, document, currentTextPosition);
}

async function setCompletion(
    autocompleteResult: AutocompleteResult | null | undefined,
    document: vscode.TextDocument,
    currentTextPosition: vscode.Position
): Promise<void> {
    await setSuggestionsState(autocompleteResult);          // 可能返回了多个可选项，所以这里先setResult
    const currentSuggestion = getCurrentSuggestion();       // 找到当前的可选项
    if (currentSuggestion) {
        await setInlineSuggestion(document, currentTextPosition, currentSuggestion);
        return;
    }
    void clearInlineSuggestionsState();
}