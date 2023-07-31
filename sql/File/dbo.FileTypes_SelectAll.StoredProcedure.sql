USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[FileTypes_SelectAll]    Script Date: 4/10/2023 13:48:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Sydney Wells
-- Create date: 4/7/2023
-- Description:	Select record(s) from dbo.FileTypes
--			    
--Params:
-- Code Reviewer: Edgar Melano

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
--
-- =============================================

CREATE PROC [dbo].[FileTypes_SelectAll]

as
/*
EXECUTE dbo.FileTypes_SelectAll
*/
BEGIN

SELECT [Id]
      ,[Name]
  FROM [dbo].[FileTypes]

END





GO
