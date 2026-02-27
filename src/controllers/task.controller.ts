import { Request, Response, NextFunction } from 'express';
import { TaskRepository } from '../repositories/task.repository';
import { 
  createTaskSchema, 
  updateTaskSchema, 
  taskIdSchema, 
  queryTaskSchema,
  CreateTaskInput,
  UpdateTaskInput,
  TaskIdInput,
  QueryTaskInput
} from '../validators/task.validator';

export class TaskController {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData: CreateTaskInput = createTaskSchema.parse(req.body);
      const task = await this.taskRepository.create(validatedData);
      
      res.status(201).json({
        success: true,
        data: task,
        message: 'Task created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedQuery: QueryTaskInput = queryTaskSchema.parse(req.query);
      const [tasks, total] = await Promise.all([
        this.taskRepository.findAll(validatedQuery),
        this.taskRepository.count(validatedQuery)
      ]);
      
      res.status(200).json({
        success: true,
        data: tasks,
        meta: {
          total,
          limit: validatedQuery.limit,
          offset: validatedQuery.offset,
          hasMore: validatedQuery.offset + validatedQuery.limit < total
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id }: TaskIdInput = taskIdSchema.parse(req.params);
      const task = await this.taskRepository.findById(id);
      
      if (!task) {
        res.status(404).json({
          success: false,
          message: 'Task not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id }: TaskIdInput = taskIdSchema.parse(req.params);
      const validatedData: UpdateTaskInput = updateTaskSchema.parse(req.body);
      
      const task = await this.taskRepository.update(id, validatedData);
      
      if (!task) {
        res.status(404).json({
          success: false,
          message: 'Task not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: task,
        message: 'Task updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id }: TaskIdInput = taskIdSchema.parse(req.params);
      const deleted = await this.taskRepository.delete(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Task not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
