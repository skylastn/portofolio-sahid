import { Entity, Column } from 'typeorm';
import { DefaultEntity } from '../../../../../shared/core/model/default_entity';

@Entity('achievements')
export class AchievementEntity extends DefaultEntity {
  @Column()
  title: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'date', type: 'timestamp' })
  date: Date;

  @Column({ name: 'image_path', type: 'text' })
  imagePath: string;
}
