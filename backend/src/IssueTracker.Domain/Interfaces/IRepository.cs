using System.Linq.Expressions;

namespace IssueTracker.Domain.Interfaces;

public interface IRepository<T> where T : class
{
    System.Threading.Tasks.Task<IEnumerable<T>> GetAllAsync();
    System.Threading.Tasks.Task<T?> GetByIdAsync(int id);
    System.Threading.Tasks.Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    System.Threading.Tasks.Task AddAsync(T entity);
    System.Threading.Tasks.Task UpdateAsync(T entity);
    System.Threading.Tasks.Task DeleteAsync(T entity);
}
