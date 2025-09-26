export interface ToggleFavoriteDto {
  questionId: number;
}

export interface ToggleFavoriteResponseDto {
  favorite: boolean;
  message: string;
}
