USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[Files_Select_ByCreatedBy]    Script Date: 4/10/2023 13:48:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Sydney Wells
-- Create date: 4/7/2023
-- Description:	Select paginated record(s) from dbo.Files
--			    By the id of user who created the record
--Params: ID of User (int)
--		  PageIndex (int)
--	      PageSize (int)
-- Code Reviewer: Edgar Melano

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
--
-- =============================================

CREATE proc [dbo].[Files_Select_ByCreatedBy]
				@PageIndex int,
				@PageSize int,
				@CreatedBy int
AS
/*

Declare @PageIndex int = 0, @PageSize int = 2, @CreatedBy int = 1

EXECUTE dbo.Files_Select_ByCreatedBy
			@PageIndex,
			@PageSize,
			@CreatedBy

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
	WHERE f.CreatedBy = @CreatedBy
	ORDER BY f.Id

	OFFSET @offset ROWS
	FETCH NEXT @PageSize ROWS ONLY

END

GO
