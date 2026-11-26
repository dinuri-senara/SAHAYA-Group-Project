using System.Collections.Generic;

namespace Sahaya.Common.Models
{
    public class Result<T>
    {
        public bool IsSuccess { get; set; }
        public T? Data { get; set; }
        public string? ErrorMessage { get; set; }
        public List<string> ValidationErrors { get; set; } = new();

        public static Result<T> Success(T data) => new() { IsSuccess = true, Data = data };
        public static Result<T> Failure(string errorMessage) => new() { IsSuccess = false, ErrorMessage = errorMessage };
        public static Result<T> Failure(List<string> errors) => new() { IsSuccess = false, ValidationErrors = errors, ErrorMessage = "Validation failed." };
    }

    public class Result
    {
        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }

        public static Result Success() => new() { IsSuccess = true };
        public static Result Failure(string errorMessage) => new() { IsSuccess = false, ErrorMessage = errorMessage };
    }
}
