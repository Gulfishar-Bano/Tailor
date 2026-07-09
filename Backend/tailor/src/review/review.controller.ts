import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateAdminReviewDto } from './dto/create-admin-review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('create')
  createReview(@Body() dto: CreateReviewDto) {
    return this.reviewService.createReview(dto);
  }

  // NOTE: needs an admin-only auth guard eventually
  @Post('admin/create')
  createAdminReview(@Body() dto: CreateAdminReviewDto) {
    return this.reviewService.createAdminReview(dto);
  }

  @Get('tailor/:tailorId')
  getTailorReviews(@Param('tailorId') tailorId: string) {
    return this.reviewService.getReviewsForTailor(tailorId);
  }
}