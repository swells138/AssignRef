USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[Files_Insert]    Script Date: 4/10/2023 13:48:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Sydney Wells
-- Create date: 4/7/2023
-- Description:Insert into dbo.Files
--			    
--Params:	@Name nvarchar(100),
--				@Url nvarchar(255),
--				@FileTypeId int,
--				@IsDeleted int,
--				@CreatedBy int,
--				@Id int OUTPUT
-- Code Reviewer: Edgar Melano

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
--
-- =============================================

CREATE proc [dbo].[Files_Insert]
				@Name nvarchar(100),
				@Url nvarchar(255),
				@FileTypeId int,
				@CreatedBy int,
				@Id int OUTPUT
AS
/*
	Declare @Id int = 0

	Declare	 @Name nvarchar(100) = 'File Name 3', 
			@Url nvarchar(255) = 'www.testFileUr183564.com',
			@FileTypeId int = 2,
			@CreatedBy int = 2

	Execute dbo.Files_Insert
		@Name,
		@Url,
		@FileTypeId,
		@CreatedBy,
		@Id OUTPUT

	SELECT	*
	FROM	dbo.Files
	Where	Id = @Id
*/
BEGIN

	INSERT INTO [dbo].[Files]
           ([Name]
           ,[Url]
           ,[FileTypeId]
           ,[CreatedBy])
     VALUES
           (@Name
           ,@Url
           ,@FileTypeId
           ,@CreatedBy)

	SET @Id = SCOPE_IDENTITY();

END
GO
