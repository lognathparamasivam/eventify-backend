import { Event } from "../../../entities/events";
import { Feedback } from "../../../entities/feedbacks";
import { User } from "../../../entities/users";
import { feedbackRepository } from "../../../respositories/feedbackRepository";
import { FeedBackService } from "../../../services/feedbackService";
import { FilterDto } from "../../../types/filterDto";
import { applyFilters, isFilterParamsValid } from "../../../utils/common";


jest.mock('../../../respositories/userRepository');
jest.mock('../../../respositories/eventRepository');
jest.mock('../../../respositories/feedbackRepository');
jest.mock('../../../utils/ErrorResponse');
jest.mock('../../../utils/common', () => ({
    ...jest.requireActual('../../../utils/common'),
    isFilterParamsValid: jest.fn(),
    applyFilters: jest.fn()
  }));
describe('FeedBackService', () => {
  let feedbackService: FeedBackService;

  beforeEach(() => {
    feedbackService = new FeedBackService();
  });

  const feedback: Feedback = {
      comment: "Test",
      user: new User(),
      userId: 5,
      event: new Event(),
      eventId: 6,
      id: 1
  };
  describe('getFeedbacks', () => {
    it('should get feedbacks based on filter and userId', async () => {
      const filter: FilterDto = { };
      const userId = 1;
      const feedbacks: Feedback[] = [feedback];
      (isFilterParamsValid as jest.Mock).mockReturnValue(true);
      (applyFilters as jest.Mock).mockReturnValue({});
      (feedbackRepository.find as jest.Mock).mockResolvedValue(feedbacks);

      const result = await feedbackService.getFeedbacks(filter, userId);
      expect(result).toEqual(feedbacks);
    });

  });


  describe('getFeedbackById', () => {
    it('should get feedback by ID and userId', async () => {
      const feedbackId = 1;
      const userId = 1;
      const feedback: Feedback = {
          comment: "Test",
          userId: 5,
          eventId: 4,
          id: 1,
          user: new User(),
          event: new Event()
      };
      (feedbackRepository.findOne as jest.Mock).mockResolvedValue(feedback);

      const result = await feedbackService.getFeedbackById(feedbackId, userId);

      expect(result).toEqual(feedback);
      expect(feedbackRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: feedbackId,
          event: { userId: userId }
        }
      });
    });

  });
});
