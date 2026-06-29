package com.example.demo.exception;

public class BusinessValidationException extends RuntimeException
{
    public BusinessValidationException()
    {
        super();
    }
    public BusinessValidationException(String msg)
    {
        super(msg);
    }
    public BusinessValidationException(String msg,Throwable cause)
    {
        super(msg,cause);
    }
    public BusinessValidationException(Throwable cause)
    {
        super(cause);
    }
}
