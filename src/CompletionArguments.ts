import { Position } from "vscode";
import { ResultEntry } from "./requests/requests";
import { SuggestionTrigger } from "./globals/consts";

export type CompletionArguments = {
  currentCompletion: string;
  completions: ResultEntry[];
  position: Position;
  limited: boolean;
  oldPrefix?: string;
  suggestionTrigger?: SuggestionTrigger;
};
