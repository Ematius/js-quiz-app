-- CreateTable
CREATE TABLE `favorite` (
    `user_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,

    INDEX `question_id`(`question_id`),
    PRIMARY KEY (`user_id`, `question_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` TEXT NOT NULL,
    `answer` VARCHAR(255) NOT NULL,
    `level` ENUM('junior', 'senior', 'guru') NOT NULL,
    `method` VARCHAR(100) NOT NULL,
    `method_type` ENUM('array', 'string') NOT NULL,
    `mode_answer` ENUM('teorica', 'practica') NOT NULL,
    `explanation` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `acc` VARCHAR(50) NOT NULL,
    `pass` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `last_question_id` INTEGER NULL,

    UNIQUE INDEX `acc`(`acc`),
    UNIQUE INDEX `email`(`email`),
    INDEX `last_question_id`(`last_question_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_progress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,
    `is_correct` BOOLEAN NOT NULL,

    INDEX `question_id`(`question_id`),
    UNIQUE INDEX `unique_user_question`(`user_id`, `question_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `favorite` ADD CONSTRAINT `favorite_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `favorite` ADD CONSTRAINT `favorite_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`last_question_id`) REFERENCES `question`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_progress` ADD CONSTRAINT `user_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_progress` ADD CONSTRAINT `user_progress_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `question`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
