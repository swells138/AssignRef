USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[Files_Search]    Script Date: 5/2/2023 17:48:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Sydney Wells
-- Create date: 4/7/2023
-- Description:	Select paginated record(s) from dbo.Files
--			    
--Params: 
--		  PageIndex (int)
--	      PageSize (int)
--        Query
-- Code Reviewer: Edgar Melano

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
--
-- =============================================

CREATE proc [dbo].[Files_Search]
				@PageIndex int,
				@PageSize int,
				@isDeleted bit,
				@Query nvarchar(50)

AS
/*

Declare @PageIndex int= 0,
		@PageSize int = 40,
		@isDeleted bit = 'false',
		@Query nvarchar(50) = 'rat'

EXECUTE dbo.Files_Search
				@PageIndex,
				@PageSize,
				@isDeleted,
				@Query

*/
BEGIN

	DECLARE @offset int = @PageIndex * @PageSize

	SELECT f.Id
		  ,f.Name
		  ,f.Url
		  ,f.IsDeleted
		  ,f.CreatedBy
		  ,f.DateCreated
		  ,ft.Id 
		  ,ft.Name 
		  ,TotalCount = COUNT(1)OVER()

	  FROM dbo.Files as f INNER JOIN dbo.FileTypes as ft
					ON f.FileTypeId = ft.Id
					Where ((f.IsDeleted = @isDeleted)AND ((f.name LIKE '%' + @Query + '%') OR (ft.Name LIKE '%' + @Query + '%') OR (f.CreatedBy LIKE '%' + @Query + '%')) )
					ORDER BY f.Id
					OFFSET @offset ROWS
					FETCH NEXT @PageSize ROWS ONLY

END
GO
