USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[Files_SelectAll]    Script Date: 4/10/2023 13:48:37 ******/
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
-- Code Reviewer: Edgar Melano

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
--
-- =============================================

CREATE proc [dbo].[Files_SelectAll]
				@PageIndex int,
				@PageSize int
AS
/*
Declare @PageIndex int=0,
		@PageSize int = 3

EXECUTE dbo.Files_SelectAll
				@PageIndex,
				@PageSize

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
	ORDER BY f.Id
	OFFSET @offset ROWS
	FETCH NEXT @PageSize ROWS ONLY

END
GO
