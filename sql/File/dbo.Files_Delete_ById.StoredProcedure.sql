USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[Files_Delete_ById]    Script Date: 4/10/2023 13:48:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Sydney Wells
-- Create date: 4/7/2023
-- Description:	Delete record from dbo.Files
--			    By the Id
--Params: ID (int)
--		  
-- Code Reviewer: Edgar Melano

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
--
-- =============================================


CREATE proc [dbo].[Files_Delete_ById]
					@Id int 
AS
/*

	Declare @Id int = 1

	Execute dbo.Files_Delete_ById
				@Id

	Select *
	From dbo.Files

*/
BEGIN

			UPDATE dbo.Files
			SET IsDeleted = 1
			WHERE Id = @Id

END





GO
