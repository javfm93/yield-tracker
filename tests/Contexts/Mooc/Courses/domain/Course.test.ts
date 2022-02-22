import { CreateCourseCommandMother } from '../application/CreateCourseCommandMother';
import { CourseMother } from './CourseMother';
import { CourseIdMother } from '../../Shared/domain/Courses/CourseIdMother';
import { CourseNameMother } from './CourseNameMother';
import { CourseDurationMother } from './CourseDurationMother';

describe('User', () => {
  it('should return a new user instance', () => {
    const command = CreateCourseCommandMother.random();

    const course = CourseMother.fromCommand(command);

    expect(course.id.value).toBe(command.id);
    expect(course.name.value).toBe(command.name);
    expect(course.duration.value).toBe(command.duration);
  });

  it('should record a CourseCreatedDomainEvent after its creation', () => {
    const course = Course.create(CourseIdMother.random(), CourseNameMother.random(), CourseDurationMother.random());

    const events = course.pullDomainEvents();

    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe('course.created');
  });
});
