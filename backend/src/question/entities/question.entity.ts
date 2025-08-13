import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('question')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  question: string;

  @Column({ length: 255 })
  answer: string;

  @Column({
    type: 'enum',
    enum: ['junior', 'senior', 'guru'],
  })
  level: 'junior' | 'senior' | 'guru';

  @Column({ length: 100 })
  method: string;

  @Column({
    type: 'enum',
    enum: ['array', 'string'],
  })
  method_type: 'array' | 'string';
  @Column({
    type: 'enum',
    enum: ['teorica', 'practica'],
  })
  mode_answer: 'teorica' | 'practica';

  @Column('text', { nullable: true })
  explanation: string | null;
}
