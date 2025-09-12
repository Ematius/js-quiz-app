import { Body, Controller, Get,  Param, ParseIntPipe, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { Question } from './entities/question.entity';
import { AnswerInviteDto, AnswerQuestionDto } from './dto/answer.question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { ToggleQuestionDto } from './dto/toggle.question.dto';


@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  async findAll(): Promise<Question[]> {
    return await this.questionService.findAll();
  }

  @Get('invite/next')
  async getOneQuestion(@Query('lastId') lastId: number): Promise<Question> {
    return this.questionService.getOneQuestion(lastId);
  }

  @Post('invite/answer')
  answerInvite(@Body() dto: AnswerInviteDto) {
    return this.questionService.answerInvite(dto);
  }


  // @UseGuards(JwtAuthGuard)
  // @Get('acc/next')
  // getNextQuestionWithAcc(@Query('lastId', ParseIntPipe) lastId: number) {
  //   return this.questionService.getNextQuestion(lastId);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  getFavorites(@Req() req) {
    return this.questionService.getFavorites(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Question> {
    return await this.questionService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('answer')
  async registerProgress(@Body() dto: AnswerQuestionDto) {
    return await this.questionService.registerProgress(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('favorite/toggle')
  toggleFavorite(@Req() req, @Body() dto: ToggleQuestionDto) {
    return this.questionService.toggleFavorite(req.user.id, dto.questionId);
  }
}
