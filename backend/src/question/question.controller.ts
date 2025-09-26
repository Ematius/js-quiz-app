import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { Question } from './entities/question.entity';
import { AnswerInviteDto, AnswerQuestionDto } from './dto/answer.question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { ToggleQuestionDto } from './dto/toggle.question.dto';



@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('invite/next')
  async getOneQuestion(@Query('lastId') lastId: number): Promise<Question> {
    return this.questionService.getOneQuestion(+lastId);
  }

  @Post('invite/answer')
  answerInvite(@Body() dto: AnswerInviteDto) {
    return this.questionService.answerInvite(dto);
  }


  
  @UseGuards(JwtAuthGuard)
  @Post('progress')
  async updateProgress(@Req() req, @Body() dto: AnswerQuestionDto) {
    return this.questionService.updateProgress(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('progress')
  async readProgress(@Req() req) {
    return this.questionService.readProgress(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('favorite/toggle')
  async postToggleFavorite(@Req() req, @Body() dto: ToggleQuestionDto) {
    return await this.questionService.PostToggleFavorite(
      req.user.id,
      dto.questionId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  async getFavorites(@Req() req) {
    return await this.questionService.getFavorites(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorite/:questionId')
  async checkFavoriteInUser(
    @Req() req,
    @Param('questionId', ParseIntPipe) questionId: number,
  ) {
    return {
      favorite: await this.questionService.checkFavoriteInUser(
        req.user.id,
        questionId,
      ),
    };
  }
}
