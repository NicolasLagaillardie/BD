#install the required packages if needed
#install.packages("funFEM")
#install.packages("fda")

#load the required libraries
library(funFEM)
library(fda)

# DATA ----
data(velib)   # hourly data one 1 week, from Sunday 1st Sept. - Sunday 7th Sept
data<-velib$data

#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#%%%%%%%%%%%%%%%%%%%%%%%%%%                                         %%%%%%%%%%%%%%%%%%%%%%%%%%%
###########################         (1) Visualize the data          ###########################
#%%%%%%%%%%%%%%%%%%%%%%%%%%                                         %%%%%%%%%%%%%%%%%%%%%%%%%%%
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

matplot(t(data)[,2:4],type='l',lwd=2,ylim=c(0,1), ylab = "loading profiles", xlab = "time")

#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#%%%%%%%%%%%%%%%%%%%%%%%%%%                                         %%%%%%%%%%%%%%%%%%%%%%%%%%%
########################### (2) Adjust the data using Fourier basis ###########################
#%%%%%%%%%%%%%%%%%%%%%%%%%%                                         %%%%%%%%%%%%%%%%%%%%%%%%%%%
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

nbasis <- 21
  basis <- create.fourier.basis(rangeval=c(1,168), nbasis= nbasis) 
fdobj <- smooth.basis(argvals=1:168, t(data[,1:168]), fdParobj=basis)$fd
par(mfrow = c(1,1))
matplot(t(data)[,150],type='l',lwd=2,ylim=c(0,1), ylab = "loading profiles", xlab = "time")
lines(fdobj[150])

#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#%%%%%%%%%%%%%%%%%%%%%%%%%%                                         %%%%%%%%%%%%%%%%%%%%%%%%%%%
###########################      (3) Carry out PCA on the data      ###########################
#%%%%%%%%%%%%%%%%%%%%%%%%%%                                         %%%%%%%%%%%%%%%%%%%%%%%%%%%
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

q=4 # number of principal components

# PCA vanilla
  pca_smooth_X <- pca.fd(fdobj=fdobj, nharm=q)
par(mfrow = c(2,2))
plot.pca.fd( pca_smooth_X)

# VARIMAX criterion
pcaSmoothVarmx <- varmx.pca.fd(pca_smooth_X)
par(mfrow=c(2,2))
plot(pcaSmoothVarmx)


#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#%%%%%%%%%%%%%%%%%%%%%%%%%%                                                        %%%%%%%%%%%%%%%%%%%%%%%%%%%
########################### (3) Clustering over the Fourier basis and over the PCA ###########################
#%%%%%%%%%%%%%%%%%%%%%%%%%%                                                        %%%%%%%%%%%%%%%%%%%%%%%%%%%
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


K <- 8        # nombre de clusters
  
  ###################  [a] Fourier  #################
cl<- kmeans(t(fdobj$coefs), K)

# reconstruction of the clusters' centers
fct_basis<- eval.basis(evalarg=1:168, basisobj=basis) # function value in the Fourier basis
centers = fct_basis%*%t(cl$centers)                 # projection dans la base initiale
  
  ###################  [b] ACP  #################
clFPCA<- kmeans(pca_smooth_X$scores, K)

# reconstruction of the clusters' centers
coeff_of_the_centers_in_original_plan<-clFPCA$centers
average_of_the_data<-rowMeans(data)
centersFPCA = coeff_of_the_centers_in_original_plan%*%t(fct_basis) + average_of_the_data

# plot of the centers
par(mfrow = c(1,1))
matplot(centers, type = "l", col=1:K, main = "Fourier clustering")
matplot(centersFPCA, type = "l", col=1:K, main = "ACP clustering")

# ################# [c] Plot ###############
install.packages("ggmap")
library(ggmap)
# possibilité 1: charger mymap en ligne
load("Mymap")
# possibilité 2: charger mymap dans dossier
setwd("C:\Users\Lagai\AppData\Local\Temp\RtmpKQmbJ5\downloaded_packages")
load("mymap.Rdata")

ggmap(Mymap) + geom_point(data=velib$position,aes(longitude,latitude),
                          colour = I(your_cluster_Fourier), size = I(3), shape = your_cluster_Fourier)

ggmap(Mymap) + geom_point(data=velib$position,aes(longitude,latitude),
                          colour = I(your_cluster_FPCA), size = I(3), shape = your_cluster_FPCA)

#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#%%%%%%%%%%%%%%%%%%%%%%%%%%                                         %%%%%%%%%%%%%%%%%%%%%%%%%%%
###########################             (4) Prediction              ###########################
#%%%%%%%%%%%%%%%%%%%%%%%%%%                                         %%%%%%%%%%%%%%%%%%%%%%%%%%%
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

#Your turn!

#Good luck!