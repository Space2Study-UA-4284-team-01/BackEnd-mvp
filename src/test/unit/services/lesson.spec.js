const lessonService = require('~/services/lesson')
const Lesson = require('~/models/lesson')

jest.mock('~/models/lesson')

describe('Lesson Service Unit Tests', () => {
  const mockAuthor = '60f72360f044231f8e2b2601'

  const mockLessonData = {
    title: 'Valid Title',
    description: 'Valid Description',
    category: '60f72360f044231f8e2b2602'
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a lesson successfully', async () => {
    const mockCreatedLesson = {
      _id: '60f72360f044231f8e2b9999',
      ...mockLessonData,
      author: mockAuthor
    }

    Lesson.create.mockResolvedValue(mockCreatedLesson)

    const result = await lessonService.createLesson(mockAuthor, mockLessonData)

    expect(Lesson.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: mockLessonData.title,
        description: mockLessonData.description,
        category: mockLessonData.category,
        author: mockAuthor
      })
    )

    expect(result).toEqual(mockCreatedLesson)
    expect(result._id).toBeDefined()
    expect(result.author).toBe(mockAuthor)
  })
    
  it('should throw error if title is missing', async () => {
    const invalidData = {
        description: 'Missing title',
        category: mockLessonData.category
    }

    await expect(
        lessonService.createLesson(mockAuthor, invalidData)
    ).rejects.toThrow(/title/i)

    expect(Lesson.create).not.toHaveBeenCalled()
  })
})
