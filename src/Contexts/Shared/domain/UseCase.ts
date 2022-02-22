export interface UseCase<Arguments, ReturnType> {
  execute(args: Arguments): ReturnType | Promise<ReturnType>;
}
